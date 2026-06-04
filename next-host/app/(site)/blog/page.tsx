import { PageTitle, SubApp } from '@shared/components';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import BlogArticleList from '@/components/blog/BlogArticleList';
import BlogListFilters from '@/components/blog/BlogListFilters';
import { getArticles } from '@/lib/serverApi';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '博客 | 王刘永的个人网站',
  description: '技术笔记与工程实践文章',
};

export interface BlogListPageProps {
  searchParams: Promise<{ category?: string; tag?: string }>;
}

/** 博客列表 — 服务端渲染文章列表，筛选通过 URL 参数触发重新请求 */
export default async function BlogListPage({ searchParams }: BlogListPageProps) {
  const { category, tag } = await searchParams;

  const [allArticles, articles] = await Promise.all([
    getArticles(),
    getArticles({
      category: category || undefined,
      tag: tag || undefined,
    }),
  ]);

  const categories = Array.from(
    new Set(allArticles.map((a) => a.category).filter(Boolean)),
  ) as string[];

  return (
    <SubApp>
      <PageTitle className="mb-6">博客</PageTitle>
      <Suspense fallback={null}>
        <BlogListFilters categories={categories} />
      </Suspense>
      <BlogArticleList articles={articles} />
    </SubApp>
  );
}
