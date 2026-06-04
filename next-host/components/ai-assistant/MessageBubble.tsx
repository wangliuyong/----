'use client';

import { lazy, Suspense } from 'react';
import { bubbleMarkdownComponents } from './BubbleMarkdown';
import { ChartBlock } from './ChartBlock';
import { CodeBlock } from './CodeBlock';
import type { ChatMessage } from '@/hooks/useAiChat';
import { AssistantAvatar } from './AssistantAvatar';
import { UserAvatar } from './UserAvatar';

const ReactMarkdown = lazy(() => import('react-markdown'));

interface MessageBubbleProps {
  message: ChatMessage;
}

/** 单条聊天气泡：统一行布局（头像 + 昵称 + 气泡），用户 / 助手仅配色与对齐不同 */
export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <article className={`ai-bubble ai-bubble--${message.role}`}>
      <div className="ai-bubble__row">
        {/* {isUser ? null : <div className="ai-bubble__avatar" aria-hidden>
          <AssistantAvatar size="sm" />
        </div>} */}


        <div className="ai-bubble__content">
          <div className="ai-bubble__meta">
            <span className="ai-bubble__name">{isUser ? null : 'Site Pup'}</span>
          </div>

          <div className="ai-bubble__body">
            {isUser ? (
              <p className="ai-bubble__text">{message.content}</p>
            ) : (
              <>
                {message.content ? (
                  <div className="ai-bubble__md ai-prose">
                    <Suspense fallback={<p className="ai-bubble__md-loading">正在排版…</p>}>
                      <ReactMarkdown components={bubbleMarkdownComponents}>
                        {message.content}
                      </ReactMarkdown>
                    </Suspense>
                  </div>
                ) : null}
                {message.blocks?.map((block, i) =>
                  block.kind === 'chart' ? (
                    <ChartBlock key={`c-${i}`} option={block.option} />
                  ) : (
                    <CodeBlock key={`d-${i}`} language={block.language} code={block.code} />
                  ),
                )}
                {message.loading && !message.content && !message.blocks?.length && (
                  <div className="ai-bubble__typing" aria-live="polite">
                    <span />
                    <span />
                    <span />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
