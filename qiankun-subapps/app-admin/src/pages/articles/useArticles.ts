import { useAdminQuery } from '../../hooks/useAdminQuery';
import { adminApi } from '../../utils/adminApi';
import type { Article } from '../../types';

/** 博客列表数据 */
export function useArticles() {
  const { data, loading, error, reload } = useAdminQuery<Article[]>(adminApi.listArticles);
  return { articles: data ?? [], loading, error, reload };
}
