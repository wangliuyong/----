import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Article } from '../../../../../_shared/contentTypes';
import { useBlogRoute } from '../../../../../_shared/hooks';
import { useApiBase } from '../../../context/ApiBaseContext';
import { webApi } from '../../../utils/webApi';

/** 博客列表 / 详情数据与筛选状态 */
export function useBlog() {
  const apiBase = useApiBase();
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
        const data = await webApi.getArticle(apiBase, articleId);
        setDetail(data);
        setArticles([]);
      } else {
        const list = await webApi.listArticles(apiBase, {
          category: filterCategory || undefined,
          tag: filterTag || undefined,
        });
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

  return {
    mode,
    articles,
    detail,
    filterCategory,
    setFilterCategory,
    filterTag,
    setFilterTag,
    categories,
    loading,
    error,
    reload: load,
  };
}
