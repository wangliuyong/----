'use client';

import { useCallback, useState } from 'react';
import { useAiChat } from '@/hooks/useAiChat';
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
  const { messages, streaming, sendMessage, clearMessages } = useAiChat();

  const handleOpen = useCallback(() => {
    setChatOpen(true);
    setHovered(false);
  }, []);

  const handleClose = useCallback(() => {
    setChatOpen(false);
    setHovered(false);
  }, []);

  const { top, dragging, bindMascot } = useAiWidgetDrag(handleOpen);

  return (
    <div
      className={`ai-widget ${chatOpen ? 'ai-widget--chat-open' : ''} ${hovered ? 'ai-widget--hovered' : ''} ${dragging ? 'ai-widget--dragging' : ''}`}
      style={{ top: `${top}px` }}
      aria-label="AI 站点助手"
    >
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

      <section className="ai-widget__panel-wrap" aria-hidden={!chatOpen}>
        {chatOpen && (
          <ChatPanel
            messages={messages}
            streaming={streaming}
            onSend={sendMessage}
            onClear={clearMessages}
            onClose={handleClose}
          />
        )}
      </section>
    </div>
  );
}
