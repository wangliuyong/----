'use client';

import { lazy, Suspense } from 'react';
import { ChartBlock } from './ChartBlock';
import { CodeBlock } from './CodeBlock';
import type { ChatMessage } from '@/hooks/useAiChat';
import { MascotAvatar } from './MascotAvatar';

const ReactMarkdown = lazy(() => import('react-markdown'));

interface MessageBubbleProps {
  message: ChatMessage;
}

/** 单条聊天气泡：Markdown + 图表/代码富块 */
export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <article className={`ai-bubble ai-bubble--${message.role}`}>
      {!isUser && (
        <span className="ai-bubble__avatar" aria-hidden>
          <MascotAvatar mini />
        </span>
      )}
      <div className="ai-bubble__body">
        {isUser ? (
          <p>{message.content}</p>
        ) : (
          <>
            {message.content ? (
              <div className="ai-bubble__md">
                <Suspense fallback={<p className="ai-bubble__md-loading">…</p>}>
                  <ReactMarkdown>{message.content}</ReactMarkdown>
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
    </article>
  );
}
