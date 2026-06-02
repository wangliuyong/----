import { marked } from 'marked';
import Prism from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';

/** 将 Markdown 转为 HTML 并对代码块做 Prism 高亮 */
export function renderMarkdownHtml(content: string): string {
  const html = marked.parse(content, { async: false }) as string;
  const wrap = document.createElement('div');
  wrap.innerHTML = html;
  wrap.querySelectorAll('pre code').forEach((block) => {
    Prism.highlightElement(block as HTMLElement);
  });
  return wrap.innerHTML;
}
