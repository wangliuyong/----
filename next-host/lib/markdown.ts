import { marked } from 'marked';

/** 服务端将 Markdown 转为 HTML（不做 Prism 高亮，由客户端 hydration 补充） */
export function renderMarkdownHtml(content: string): string {
  return marked.parse(content, { async: false }) as string;
}
