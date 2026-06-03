'use client';

import { useCallback, useEffect, useState, type CSSProperties } from 'react';
import { useAiChat } from '@/hooks/useAiChat';
import { useAiPanelPlacement } from '@/hooks/useAiPanelPlacement';
import { useAiWidgetDrag } from '@/hooks/useAiWidgetDrag';
import { ChatPanel } from './ChatPanel';
import { MascotAvatar } from './MascotAvatar';

/**
 * 全局 AI 小助手
 * - 默认：线条萌犬吸附在右侧，仅露出半边
 * - 悬停：向左探出完整形象
 * - 拖动：上下移动，松手吸附上 / 中 / 下
 * - 点击：打开聊天面板
 */
export function AiAssistantWidget() {
  const [hovered, setHovered] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [panelFullscreen, setPanelFullscreen] = useState(false);
  const { messages, streaming, sendMessage, clearMessages } = useAiChat();

  const handleOpen = useCallback(() => {
    setChatOpen(true);
    setHovered(false);
  }, []);

  const handleClose = useCallback(() => {
    setChatOpen(false);
    setPanelFullscreen(false);
    setHovered(false);
  }, []);

  const togglePanelFullscreen = useCallback(() => {
    setPanelFullscreen((v) => !v);
  }, []);

  /** Esc 退出全屏（仍保持聊天打开） */
  useEffect(() => {
    if (!chatOpen || !panelFullscreen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPanelFullscreen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [chatOpen, panelFullscreen]);

  const { top, dragging, bindMascot } = useAiWidgetDrag(handleOpen);
  const { centerY: panelCenterY, maxHeight: panelMaxHeight } = useAiPanelPlacement(chatOpen);

  /** 折叠态：未悬停、未打开聊天、未拖动 */
  const folded = !chatOpen && !hovered && !dragging;
  /** 喊话气泡：折叠或悬停时显示（开聊天 / 拖动时隐藏） */
  const showShout = !chatOpen && !dragging;

  const widgetStyle: CSSProperties = {
    top: `${top}px`,
    ...(chatOpen
      ? {
          '--ai-panel-center-y': `${panelCenterY}px`,
          '--ai-panel-max-h': `${panelMaxHeight}px`,
        }
      : {}),
  };

  return (
    <div
      className={`ai-widget ${chatOpen ? 'ai-widget--chat-open' : ''} ${panelFullscreen ? 'ai-widget--panel-fullscreen' : ''} ${hovered ? 'ai-widget--hovered' : ''} ${dragging ? 'ai-widget--dragging' : ''} ${folded ? 'ai-widget--folded' : ''}`}
      style={widgetStyle}
      aria-label="AI 站点助手"
    >
      {/* 折叠态漫画喊话：锯齿爆炸气泡 + 声波线 */}
      <div className="ai-widget__shout" aria-hidden={!showShout}>
        <svg
          className="ai-widget__shout-waves"
          viewBox="0 0 24 20"
          width="24"
          height="20"
          aria-hidden="true"
        >
          <path
            className="ai-widget__shout-wave ai-widget__shout-wave--1"
            d="M20 10 C16 10 14 6 10 6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            className="ai-widget__shout-wave ai-widget__shout-wave--2"
            d="M20 10 C15 10 12 3 6 3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            className="ai-widget__shout-wave ai-widget__shout-wave--3"
            d="M20 10 C14 10 10 1 2 1"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <div className="ai-widget__shout-bubble">
          <span className="ai-widget__shout-text ai-widget__shout-text--idle">
            主人<span className="ai-widget__shout-em">快点我</span>！
          </span>
          <span className="ai-widget__shout-text ai-widget__shout-text--hover">
            汪<span className="ai-widget__shout-em">汪汪</span>！
          </span>
        </div>
      </div>

      <button
        type="button"
        className="ai-widget__mascot"
        aria-label="拖动调整位置，点击打开站点智询"
        aria-expanded={chatOpen}
        onMouseEnter={() => !chatOpen && !dragging && setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onPointerDown={bindMascot.onPointerDown}
        onPointerMove={bindMascot.onPointerMove}
        onPointerUp={bindMascot.onPointerUp}
        onPointerCancel={bindMascot.onPointerCancel}
        onClick={(e) => bindMascot.onClick(e)}
      >
        <MascotAvatar peekedOut={hovered && !dragging} />
      </button>

      {chatOpen && panelFullscreen && (
        <button
          type="button"
          className="ai-widget__backdrop"
          aria-label="退出全屏"
          onClick={() => setPanelFullscreen(false)}
        />
      )}

      <section className="ai-widget__panel-wrap" aria-hidden={!chatOpen}>
        {chatOpen && (
          <ChatPanel
            messages={messages}
            streaming={streaming}
            fullscreen={panelFullscreen}
            onToggleFullscreen={togglePanelFullscreen}
            onSend={sendMessage}
            onClear={clearMessages}
            onClose={handleClose}
          />
        )}
      </section>
    </div>
  );
}
