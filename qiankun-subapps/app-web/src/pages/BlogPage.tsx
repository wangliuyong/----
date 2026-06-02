import { useCallback, useEffect, useMemo, useState } from 'react';
import { apiUrl, fetchJson } from '../../../_shared/api';
import {
  AppButton,
  AppInput,
  AppLink,
  AppListItem,
  ArticleBody,
  PageTitle,
  SubApp,
} from '../../../_shared/components';
import { useBlogRoute } from '../../../_shared/hooks';
import { formatDate } from '../../../_shared/utils';
import { renderMarkdownHtml } from '../utils/markdown';

interface Article {
  id: number;
  title: string;
  summary?: string;
  content: string;
  category?: string;
  tags?: string;
  publishedAt: string;
}

/** 博客：列表 / 详情 / 分类标签筛选（原 app-blog） */
export default function BlogPage({ apiBase }: { apiBase: string }) {
  const { mode, articleId } = useBlogRoute();
  const [articles, setArticles] = useState<Article[]>([]);
  const [detail, setDetail] = useState<Article | null>(null);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      if (mode === 'detail' && articleId) {
        const data = await fetchJson<Article>(
          apiUrl(apiBase, `/article/${articleId}`),
        );
        setDetail(data);
        setArticles([]);
      } else {
        const params = new URLSearchParams();
        if (filterCategory) params.set('category', filterCategory);
        if (filterTag) params.set('tag', filterTag);
        const qs = params.toString() ? `?${params}` : '';
        const list = await fetchJson<Article[]>(
          apiUrl(apiBase, `/article/list${qs}`),
        );
        setArticles(list);
        setDetail(null);
      }
    } catch {
      setError('博客加载失败');
    } finally {
      setLoading(false);
    }
  }, [apiBase, mode, articleId, filterCategory, filterTag]);

  useEffect(() => {
    void load();
  }, [load]);

  const categories = useMemo(
    () => [...new Set(articles.map((a) => a.category).filter(Boolean))] as string[],
    [articles],
  );

  if (loading) {
    return (
      <SubApp>
        <p className="text-faint">加载中...</p>
      </SubApp>
    );
  }

  if (error) {
    return (
      <SubApp>
        <p className="text-red-500">{error}</p>
      </SubApp>
    );
  }

  if (mode === 'detail' && detail) {
    return (
      <article className="sub-app">
        <AppLink href="/blog" variant="back" className="mb-4">
          返回列表
        </AppLink>
        <PageTitle className="mb-0">{detail.title}</PageTitle>
        <p className="text-sm text-faint my-2">
          {formatDate(detail.publishedAt)}
          {detail.category ? ` · ${detail.category}` : ''}
        </p>
        <ArticleBody html={renderMarkdownHtml(detail.content)} />
      </article>
    );
  }

  return (
    <SubApp>
      <PageTitle className="mb-6">博客</PageTitle>
      <div className="flex flex-wrap gap-3 mb-6">
        <select
          className="app-input w-auto min-w-[140px]"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">全部分类</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <AppInput
          className="w-auto min-w-[140px]"
          placeholder="按标签筛选"
          value={filterTag}
          onChange={(e) => setFilterTag(e.target.value)}
        />
        <AppButton onClick={() => void load()}>筛选</AppButton>
      </div>

      <div className="space-y-4">
        {articles.map((item) => (
          <AppListItem key={item.id}>
            <h2 className="text-xl font-semibold font-serif">
              <a
                href={`/blog/${item.id}`}
                className="app-list-item__title text-ink hover:no-underline"
              >
                {item.title}
              </a>
            </h2>
            <p className="text-muted mt-1">{item.summary || ''}</p>
            <p className="text-sm text-faint mt-2">
              {formatDate(item.publishedAt)}
            </p>
          </AppListItem>
        ))}
      </div>
    </SubApp>
  );
}
