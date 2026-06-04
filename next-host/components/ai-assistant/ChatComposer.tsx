'use client';

import { FormEvent, useState } from 'react';

export interface ChatComposerProps {
  streaming: boolean;
  onSend: (text: string) => void;
}

/** AI 面板底部输入区 */
export function ChatComposer({ streaming, onSend }: ChatComposerProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || streaming) return;
    onSend(input);
    setInput('');
  };

  return (
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
  );
}
