'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { MessageBubble } from './MessageBubble';
import type { ChatMessage } from '@/hooks/useAiChat';

const SUGGESTIONS = ['站点有哪些项目？', '最近写了什么博客？', '用图表展示技术栈分布'];

interface ChatPanelProps {
  messages: ChatMessage[];
  streaming: boolean;
  onSend: (text: string) => void;
  onClear: () => void;
  onClose: () => void;
}

/**
 * AI 聊天面板
 * 由父级点击打开、关闭按钮收起
 */
export function ChatPanel({ messages, streaming, onSend, onClear, onClose }: ChatPanelProps) {
  const [input, setInput] = useState('');
  const listRef = useRef<HTMLDivElement>(null);

  /** 新消息到达时滚动到底部 */
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || streaming) return;
    onSend(input);
    setInput('');
  };

  return (
    <div className="ai-panel" role="region" aria-label="站点智询">
      <header className="ai-panel__head">
        <div className="ai-panel__brand">
          <p className="ai-panel__eyebrow">Site Pup</p>
          <h2 className="ai-panel__title">站点智询</h2>
          <p className="ai-panel__sub">基于博客 · 项目 · 留言的知识检索</p>
        </div>
        <div className="ai-panel__tools">
          <button type="button" className="ai-panel__ghost" onClick={onClear}>
            清空
          </button>
          <button type="button" className="ai-panel__close" onClick={onClose} aria-label="关闭">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </header>

      <div className="ai-panel__scroll" ref={listRef}>
        {messages.length === 0 ? (
          <div className="ai-panel__empty">
            <p className="ai-panel__empty-lead">
              向站点提问，我会从已同步的知识库中检索回答。
            </p>
            <ul className="ai-panel__chips">
              {SUGGESTIONS.map((s) => (
                <li key={s}>
                  <button type="button" onClick={() => onSend(s)} disabled={streaming}>
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="ai-panel__thread">
            {messages.map((m) => (
              <MessageBubble key={m.id} message={m} />
            ))}
          </div>
        )}
      </div>

      <form className="ai-panel__composer" onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="输入问题，Enter 发送…"
          disabled={streaming}
          aria-label="问题输入"
        />
        <button type="submit" disabled={streaming || !input.trim()} aria-label="发送">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
          </svg>
        </button>
      </form>
    </div>
  );
}
