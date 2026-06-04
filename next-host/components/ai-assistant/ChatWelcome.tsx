'use client';

import { AssistantAvatar } from './AssistantAvatar';
import { CHAT_SUGGESTIONS } from './chatPanelConstants';

export interface ChatWelcomeProps {
  streaming: boolean;
  onSend: (text: string) => void;
}

/** AI 面板空状态：欢迎文案与快捷提问 */
export function ChatWelcome({ streaming, onSend }: ChatWelcomeProps) {
  return (
    <div className="ai-panel__welcome">
      <div className="ai-panel__welcome-mascot" aria-hidden>
        <AssistantAvatar size="lg" />
      </div>
      <p className="ai-panel__welcome-eyebrow">Ink &amp; Sand · AI</p>
      <h3 className="ai-panel__welcome-title">有什么想了解的？</h3>
      <p className="ai-panel__welcome-lead">
        我会从博客、项目与留言知识库中检索，为你整理回答。
      </p>
      <div className="ai-panel__suggestions">
        {CHAT_SUGGESTIONS.map(({ text, icon }) => (
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
  );
}
