import { AppLink, PageTitle, SubApp } from '@shared/components';
import { formatDate } from '@shared/utils/format';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ArticleBodyClient from '@/components/blog/ArticleBodyClient';
import { renderMarkdownHtml } from '@/lib/markdown';
import { getArticle } from '@/lib/serverApi';

export const dynamic = 'force-dynamic';

export interface BlogDetailPageProps {
  params: Promise<{ id: string }>;
}

/** 动态生成博客详情页 SEO metadata */
export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const article = await getArticle(id);

  if (!article) {
    return { title: '文章未找到' };
  }

  return {
    title: `${article.title} | 博客`,
    description: article.summary || article.title,
  };
}

/** 博客详情 — 服务端渲染标题、元信息与 Markdown 正文 */
export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { id } = await params;
  const article = await getArticle(id);

  if (!article) {
    notFound();
  }

  const html = renderMarkdownHtml(article.content);

  return (
    <SubApp className="max-w-3xl">
      <AppLink href="/blog" variant="back" className="mb-4 app-back-link">
        返回列表
      </AppLink>
      <PageTitle className="mb-0">{article.title}</PageTitle>
      <p className="text-sm text-faint my-2 app-section">
        {formatDate(article.publishedAt)}
        {article.category ? ` · ${article.category}` : ''}
      </p>
      <ArticleBodyClient className="app-article-body" html={html} />
    </SubApp>
  );
}
