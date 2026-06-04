'use client';

import type { Components } from 'react-markdown';

/**
 * 聊天气泡内 Markdown 的自定义渲染映射。
 * 为各语义标签挂载 ai-prose__* 类名，便于 SCSS 做精细化排版。
 */
export const bubbleMarkdownComponents: Components = {
  /** 段落：气泡内正文的基本单元 */
  p: ({ children }) => <p className="ai-prose__p">{children}</p>,

  /** 标题层级：助手回复中的小标题 */
  h1: ({ children }) => <h3 className="ai-prose__h ai-prose__h--1">{children}</h3>,
  h2: ({ children }) => <h3 className="ai-prose__h ai-prose__h--2">{children}</h3>,
  h3: ({ children }) => <h3 className="ai-prose__h ai-prose__h--3">{children}</h3>,

  /** 强调与斜体 */
  strong: ({ children }) => <strong className="ai-prose__strong">{children}</strong>,
  em: ({ children }) => <em className="ai-prose__em">{children}</em>,

  /** 外链：新窗口打开并带安全属性 */
  a: ({ href, children }) => (
    <a
      className="ai-prose__link"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),

  /** 无序列表 */
  ul: ({ children }) => <ul className="ai-prose__ul">{children}</ul>,
  /** 有序列表 */
  ol: ({ children }) => <ol className="ai-prose__ol">{children}</ol>,
  li: ({ children }) => <li className="ai-prose__li">{children}</li>,

  /** 引用块：用于摘录或补充说明 */
  blockquote: ({ children }) => (
    <blockquote className="ai-prose__quote">{children}</blockquote>
  ),

  /** 行内代码 */
  code: ({ className, children }) => {
    const isBlock = Boolean(className);
    if (isBlock) {
      return <code className={className}>{children}</code>;
    }
    return <code className="ai-prose__code">{children}</code>;
  },

  /** 代码块容器 */
  pre: ({ children }) => <pre className="ai-prose__pre">{children}</pre>,

  /** 分隔线 */
  hr: () => <hr className="ai-prose__hr" />,
};
