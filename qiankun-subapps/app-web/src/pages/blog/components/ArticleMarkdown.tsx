import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypePrism from 'rehype-prism-plus';
import { cn } from '../../../../../_shared/utils/cn';
import { articleMarkdownComponents } from './ArticleMarkdownComponents';

// rehype-prism-plus 依赖 Prism 语言包，按需注册常用语法
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-yaml';

export interface ArticleMarkdownProps {
  /** Markdown 源文本 */
  content: string;
  className?: string;
}

/**
 * 博客正文 Markdown 渲染器。
 *
 * 使用 react-markdown 解析 AST，remark-gfm 支持 GFM 扩展语法（表格、任务列表等），
 * rehype-prism-plus 负责代码块 Prism 高亮。默认不渲染原始 HTML，降低 XSS 风险。
 */
export default function ArticleMarkdown({ content, className }: ArticleMarkdownProps) {
  return (
    <div className={cn('article-prose max-w-none', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypePrism, { ignoreMissing: true }]]}
        components={articleMarkdownComponents}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
