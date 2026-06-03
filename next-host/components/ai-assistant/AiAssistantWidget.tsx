'use client';

import { useCallback, useState } from 'react';
import { useAiChat } from '@/hooks/useAiChat';
import { ChatPanel } from './ChatPanel';
import { DogAvatar } from './DogAvatar';

/**
 * 全局 AI 小助手
 * - 默认：萌狗双爪趴在屏幕右缘，仅露出脑袋与爪子
 * - 悬停：狗狗慢慢向左探出
 * - 点击：打开聊天面板；关闭后恢复原状
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

  return (
    <div
      className={`dog-widget ${chatOpen ? 'dog-widget--chat-open' : ''} ${hovered ? 'dog-widget--hovered' : ''}`}
      aria-label="AI 站点助手"
    >
      {/* 趴在右缘的狗狗：悬停探出，点击打开聊天 */}
      <button
        type="button"
        className="dog-widget__mascot"
        aria-label="打开站点智询"
        aria-expanded={chatOpen}
        onMouseEnter={() => !chatOpen && setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={handleOpen}
      >
        <DogAvatar walkedOut={hovered} />
      </button>

      {/* 聊天面板：点击打开，关闭按钮收起 */}
      <section
        className="dog-widget__panel-wrap"
        aria-hidden={!chatOpen}
      >
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
