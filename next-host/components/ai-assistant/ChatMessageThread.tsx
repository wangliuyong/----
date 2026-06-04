'use client';

import type { ChatMessage } from '@/hooks/useAiChat';
import { MessageBubble } from './MessageBubble';

export interface ChatMessageThreadProps {
  messages: ChatMessage[];
}

/** AI 面板消息列表 */
export function ChatMessageThread({ messages }: ChatMessageThreadProps) {
  return (
    <div className="ai-panel__thread">
      {messages.map((m) => (
        <MessageBubble key={m.id} message={m} />
      ))}
    </div>
  );
}
