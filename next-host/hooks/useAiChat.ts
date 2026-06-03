'use client';

import { useCallback, useRef, useState } from 'react';
import { API_BASE } from '@/utils/api';

/** SSE 流式事件类型（与 nest-server ai-chat.service 一致） */
export type AiChatEvent =
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
 * 对接 POST /api/ai/chat 流式响应
 */
export function useAiChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streaming, setStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

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
          body: JSON.stringify({ message: trimmed }),
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

            if (event.type === 'token') {
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

  const clearMessages = useCallback(() => setMessages([]), []);

  return { messages, streaming, sendMessage, clearMessages };
}
