import { listArticles } from '../../api/articles.api';
import { useAdminQuery } from '../../hooks/useAdminQuery';
import type { Article } from '../../types';

/** 博客列表数据 */
export function useArticles() {
  const { data, loading, error, reload } = useAdminQuery<Article[]>(listArticles);
  return { articles: data ?? [], loading, error, reload };
}
