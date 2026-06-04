'use client';

import { useCallback, useRef, useState } from 'react';
import { API_BASE } from '@/utils/api';

const SESSION_STORAGE_KEY = 'ai-assistant-session-id';

/** SSE 流式事件类型（与 nest-server ai-chat.service 一致） */
export type AiChatEvent =
  | { type: 'session'; sessionId: string }
  | { type: 'token'; content: string }
  | { type: 'tool_start'; name: string }
  | { type: 'tool_result'; name: string; content: string }
  | { type: 'done' }
  | { type: 'error'; message: string };

/** 工具返回的富内容块 */
export type RichBlock =
  | { kind: 'chart'; option: Record<string, unknown> }
  | { kind: 'code'; language: string; code: string };

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  blocks?: RichBlock[];
  loading?: boolean;
}

/** 生成会话 ID；HTTP 非安全上下文下 crypto.randomUUID 不可用 */
function createSessionId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `sess-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

/** 读取或创建会话 ID，用于服务端 LangGraph thread_id 记忆 */
function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') {
    return `ssr-${Date.now()}`;
  }
  const stored = localStorage.getItem(SESSION_STORAGE_KEY);
  if (stored && /^[\w-]+$/.test(stored) && stored.length <= 128) {
    return stored;
  }
  const id = createSessionId();
  localStorage.setItem(SESSION_STORAGE_KEY, id);
  return id;
}

/** 解析 tool_result 中的 chart / code 块 */
function parseToolResult(content: string): RichBlock | null {
  try {
    const parsed = JSON.parse(content) as {
      type?: string;
      option?: Record<string, unknown>;
      language?: string;
      code?: string;
    };
    if (parsed.type === 'chart' && parsed.option) {
      return { kind: 'chart', option: parsed.option };
    }
    if (parsed.type === 'code' && parsed.code) {
      return { kind: 'code', language: parsed.language ?? 'text', code: parsed.code };
    }
  } catch {
    /* 非 JSON 工具结果忽略 */
  }
  return null;
}

/**
 * AI 聊天 SSE Hook
 * 对接 POST /api/ai/chat；sessionId 对应 LangGraph MemorySaver 多轮记忆
 */
export function useAiChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streaming, setStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const sessionIdRef = useRef<string>(getOrCreateSessionId());

  const persistSessionId = (id: string) => {
    sessionIdRef.current = id;
    if (typeof window !== 'undefined') {
      localStorage.setItem(SESSION_STORAGE_KEY, id);
    }
  };

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || streaming) return;

      const userMsg: ChatMessage = {
        id: `u-${Date.now()}`,
        role: 'user',
        content: trimmed,
      };
      const assistantId = `a-${Date.now()}`;
      const assistantMsg: ChatMessage = {
        id: assistantId,
        role: 'assistant',
        content: '',
        blocks: [],
        loading: true,
      };

      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setStreaming(true);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch(`${API_BASE}/ai/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: trimmed,
            sessionId: sessionIdRef.current,
          }),
          signal: controller.signal,
        });

        if (!res.ok || !res.body) {
          throw new Error(`请求失败: ${res.status}`);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const payload = line.slice(6).trim();
            if (!payload) continue;

            let event: AiChatEvent;
            try {
              event = JSON.parse(payload) as AiChatEvent;
            } catch {
              continue;
            }

            if (event.type === 'session') {
              persistSessionId(event.sessionId);
            } else if (event.type === 'token') {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, content: m.content + event.content } : m,
                ),
              );
            } else if (event.type === 'tool_result') {
              const block = parseToolResult(event.content);
              if (block) {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId
                      ? { ...m, blocks: [...(m.blocks ?? []), block] }
                      : m,
                  ),
                );
              }
            } else if (event.type === 'error') {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId
                    ? { ...m, content: m.content || event.message, loading: false }
                    : m,
                ),
              );
            }
          }
        }
      } catch (e) {
        if ((e as Error).name !== 'AbortError') {
          const errMsg = e instanceof Error ? e.message : '网络异常';
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: m.content || errMsg, loading: false } : m,
            ),
          );
        }
      } finally {
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, loading: false } : m)),
        );
        setStreaming(false);
        abortRef.current = null;
      }
    },
    [streaming],
  );

  /** 清空 UI 并删除服务端会话记忆，再开启新会话 */
  const clearMessages = useCallback(async () => {
    const oldSessionId = sessionIdRef.current;
    try {
      await fetch(`${API_BASE}/ai/chat/session`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: oldSessionId }),
      });
    } catch {
      /* 清空记忆失败仍重置本地会话，避免阻塞用户 */
    }
    const newSessionId = createSessionId();
    persistSessionId(newSessionId);
    setMessages([]);
  }, []);

  return { messages, streaming, sendMessage, clearMessages };
}
