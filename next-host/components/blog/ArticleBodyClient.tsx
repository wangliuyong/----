'use client';

import { ArticleBody } from '@shared/components';
import Prism from 'prismjs';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-typescript';
import { useEffect, useRef } from 'react';

export interface ArticleBodyClientProps {
  html: string;
  className?: string;
}

/**
 * 博客正文容器：SSR 输出 HTML，客户端 hydration 后补充 Prism 代码高亮
 */
export default function ArticleBodyClient({
  html,
  className,
}: ArticleBodyClientProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.querySelectorAll('pre code').forEach((block) => {
      Prism.highlightElement(block as HTMLElement);
    });
  }, [html]);

  return (
    <div ref={ref}>
      <ArticleBody className={className} html={html} />
    </div>
  );
}
