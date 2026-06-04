'use client';

import type { CSSProperties } from 'react';
import { useAiChat } from '@/hooks/useAiChat';
import { useAiPanelPlacement } from '@/hooks/useAiPanelPlacement';
import { useAiWidgetDrag } from '@/hooks/useAiWidgetDrag';
import { AiMascotDock } from './AiMascotDock';
import { ChatPanel } from './ChatPanel';
import { useAiWidgetChrome } from './hooks/useAiWidgetChrome';

/**
 * 全局 AI 小助手：萌犬挂件 + 聊天面板。
 */
export function AiAssistantWidget() {
  const chrome = useAiWidgetChrome();
  const { messages, streaming, sendMessage, clearMessages } = useAiChat();
  const { top, dragging, bindMascot } = useAiWidgetDrag(chrome.handleOpen);
  const { centerY: panelCenterY, maxHeight: panelMaxHeight } = useAiPanelPlacement(chrome.chatOpen);

  const widgetStyle: CSSProperties = {
    top: `${top}px`,
    ...(chrome.chatOpen
      ? {
          '--ai-panel-center-y': `${panelCenterY}px`,
          '--ai-panel-max-h': `${panelMaxHeight}px`,
        }
      : {}),
  };

  return (
    <div
      className={`ai-widget ${chrome.chatOpen ? 'ai-widget--chat-open' : ''} ${chrome.panelFullscreen ? 'ai-widget--panel-fullscreen' : ''} ${chrome.hovered ? 'ai-widget--hovered' : ''} ${dragging ? 'ai-widget--dragging' : ''} ${chrome.folded ? 'ai-widget--folded' : ''}`}
      style={widgetStyle}
      aria-label="AI 站点助手"
    >
      <AiMascotDock
        chatOpen={chrome.chatOpen}
        hovered={chrome.hovered}
        dragging={dragging}
        showShout={chrome.showShout && !dragging}
        bindMascot={bindMascot}
        onMouseEnter={() => !chrome.chatOpen && !dragging && chrome.setHovered(true)}
        onMouseLeave={() => chrome.setHovered(false)}
      />

      {chrome.chatOpen && chrome.panelFullscreen && (
        <button
          type="button"
          className="ai-widget__backdrop"
          aria-label="退出全屏"
          onClick={() => chrome.togglePanelFullscreen()}
        />
      )}

      <section className="ai-widget__panel-wrap" aria-hidden={!chrome.chatOpen}>
        {chrome.chatOpen && (
          <ChatPanel
            messages={messages}
            streaming={streaming}
            fullscreen={chrome.panelFullscreen}
            onToggleFullscreen={chrome.togglePanelFullscreen}
            onSend={sendMessage}
            onClear={clearMessages}
            onClose={chrome.handleClose}
          />
        )}
      </section>
    </div>
  );
}
