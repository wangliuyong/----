'use client';

import { useEffect, useRef } from 'react';
import type { ChatMessage } from '@/hooks/useAiChat';
import { ChatComposer } from './ChatComposer';
import { ChatMessageThread } from './ChatMessageThread';
import { ChatPanelHeader } from './ChatPanelHeader';
import { ChatWelcome } from './ChatWelcome';

interface ChatPanelProps {
  messages: ChatMessage[];
  streaming: boolean;
  fullscreen: boolean;
  onToggleFullscreen: () => void;
  onSend: (text: string) => void;
  onClear: () => void;
  onClose: () => void;
}

/**
 * AI 聊天面板 — 组合头部、欢迎区、消息线程与输入坞。
 */
export function ChatPanel({
  messages,
  streaming,
  fullscreen,
  onToggleFullscreen,
  onSend,
  onClear,
  onClose,
}: ChatPanelProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const isEmpty = messages.length === 0;

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, streaming]);

  return (
    <div className="ai-panel" role="region" aria-label="站点智询">
      <div className="ai-panel__glow" aria-hidden />
      <div className="ai-panel__grain" aria-hidden />

      <ChatPanelHeader
        streaming={streaming}
        fullscreen={fullscreen}
        isEmpty={isEmpty}
        onClear={onClear}
        onToggleFullscreen={onToggleFullscreen}
        onClose={onClose}
      />

      <div className="ai-panel__scroll" ref={listRef}>
        {isEmpty ? (
          <ChatWelcome streaming={streaming} onSend={onSend} />
        ) : (
          <ChatMessageThread messages={messages} />
        )}
      </div>

      <ChatComposer streaming={streaming} onSend={onSend} />
    </div>
  );
}
