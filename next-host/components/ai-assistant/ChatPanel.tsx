'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { MessageBubble } from './MessageBubble';
import { MascotAvatar } from './MascotAvatar';
import type { ChatMessage } from '@/hooks/useAiChat';

/** 空状态快捷提问 */
const SUGGESTIONS = [
  { text: '站点有哪些项目？', icon: '◆' },
  { text: '最近写了什么博客？', icon: '✎' },
  { text: '用图表展示技术栈分布', icon: '▤' },
] as const;

interface ChatPanelProps {
  messages: ChatMessage[];
  streaming: boolean;
  onSend: (text: string) => void;
  onClear: () => void;
  onClose: () => void;
}

/**
 * AI 聊天面板 — 现代化玻璃拟态布局
 * 头部身份区 · 欢迎空状态 · 消息线程 · 底部输入坞
 */
export function ChatPanel({ messages, streaming, onSend, onClear, onClose }: ChatPanelProps) {
  const [input, setInput] = useState('');
  const listRef = useRef<HTMLDivElement>(null);

  /** 新消息到达时滚动到底部 */
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, streaming]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || streaming) return;
    onSend(input);
    setInput('');
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="ai-panel" role="region" aria-label="站点智询">
      {/* 装饰层：暖色光晕 + 纸纹 */}
      <div className="ai-panel__glow" aria-hidden />
      <div className="ai-panel__grain" aria-hidden />

      <header className="ai-panel__head">
        <div className="ai-panel__identity">
          <div className="ai-panel__avatar-ring">
            <MascotAvatar mini />
            <span className="ai-panel__status" title="在线" />
          </div>
          <div className="ai-panel__brand">
            <h2 className="ai-panel__title">站点智询</h2>
            <p className="ai-panel__sub">
              Site Pup
              <span className="ai-panel__dot" aria-hidden />
              知识库检索
            </p>
          </div>
        </div>
        <div className="ai-panel__tools">
          <button
            type="button"
            className="ai-panel__ghost"
            onClick={onClear}
            disabled={isEmpty && !streaming}
          >
            清空
          </button>
          <button type="button" className="ai-panel__close" onClick={onClose} aria-label="关闭">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        {streaming && <div className="ai-panel__progress" aria-hidden />}
      </header>

      <div className="ai-panel__scroll" ref={listRef}>
        {isEmpty ? (
          <div className="ai-panel__welcome">
            <div className="ai-panel__welcome-mascot" aria-hidden>
              <MascotAvatar peekedOut />
            </div>
            <p className="ai-panel__welcome-eyebrow">Ink &amp; Sand · AI</p>
            <h3 className="ai-panel__welcome-title">有什么想了解的？</h3>
            <p className="ai-panel__welcome-lead">
              我会从博客、项目与留言知识库中检索，为你整理回答。
            </p>
            <div className="ai-panel__suggestions">
              {SUGGESTIONS.map(({ text, icon }) => (
                <button
                  key={text}
                  type="button"
                  className="ai-panel__suggestion"
                  onClick={() => onSend(text)}
                  disabled={streaming}
                >
                  <span className="ai-panel__suggestion-icon" aria-hidden>
                    {icon}
                  </span>
                  <span className="ai-panel__suggestion-text">{text}</span>
                  <svg
                    className="ai-panel__suggestion-arrow"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="ai-panel__thread">
            {messages.map((m) => (
              <MessageBubble key={m.id} message={m} />
            ))}
          </div>
        )}
      </div>

      <footer className="ai-panel__footer">
        {streaming && (
          <p className="ai-panel__streaming" aria-live="polite">
            <span className="ai-panel__streaming-dot" />
            Site Pup 正在思考…
          </p>
        )}
        <form className="ai-panel__composer" onSubmit={handleSubmit}>
          <div className="ai-panel__composer-inner">
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
          </div>
        </form>
        <p className="ai-panel__footnote">Enter 发送 · 回答基于已同步知识库</p>
      </footer>
    </div>
  );
}
