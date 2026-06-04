'use client';

import { AssistantAvatar } from './AssistantAvatar';

export interface ChatPanelHeaderProps {
  streaming: boolean;
  fullscreen: boolean;
  isEmpty: boolean;
  onClear: () => void;
  onToggleFullscreen: () => void;
  onClose: () => void;
}

/** AI 面板顶栏：身份区与工具按钮 */
export function ChatPanelHeader({
  streaming,
  fullscreen,
  isEmpty,
  onClear,
  onToggleFullscreen,
  onClose,
}: ChatPanelHeaderProps) {
  return (
    <header className="ai-panel__head">
      <div className="ai-panel__identity">
        <div className="ai-panel__avatar-ring">
          <AssistantAvatar size="md" />
          <span className="ai-panel__status" title="在线" />
        </div>
        <div className="ai-panel__brand">
          <h2 className="ai-panel__title">站点智询</h2>
          <p className="ai-panel__sub" title="Site Pup · 知识库检索">
            <span className="ai-panel__sub-en">Site Pup</span>
            <span className="ai-panel__dot" aria-hidden />
            <span className="ai-panel__sub-cn">检索助手</span>
          </p>
        </div>
      </div>
      <div className="ai-panel__tools">
        <button
          type="button"
          className="ai-panel__icon-btn ai-panel__icon-btn--ghost"
          onClick={onClear}
          disabled={isEmpty && !streaming}
          aria-label="清空对话"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
          </svg>
        </button>
        <button
          type="button"
          className="ai-panel__icon-btn"
          onClick={onToggleFullscreen}
          aria-label={fullscreen ? '退出全屏' : '全屏'}
          aria-pressed={fullscreen}
        >
          {fullscreen ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 9H5V5M15 9h4V5M9 15H5v4M15 15h4v4" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 3H5a2 2 0 00-2 2v3M16 3h3a2 2 0 012 2v3M8 21H5a2 2 0 01-2-2v-3M16 21h3a2 2 0 002-2v-3" />
            </svg>
          )}
        </button>
        <button type="button" className="ai-panel__icon-btn" onClick={onClose} aria-label="关闭">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
      {streaming && <div className="ai-panel__progress" aria-hidden />}
    </header>
  );
}
