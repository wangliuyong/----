import { useCallback, useEffect, useState } from 'react';
import type { Article } from '../types';
import { adminApi } from '../utils/adminApi';
import { useApiBase } from '../context/ApiBaseContext';

/** 博客列表页数据 */
export function useArticles() {
  const apiBase = useApiBase();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setArticles(await adminApi.listArticles(apiBase));
    } catch (e) {
      setError(e instanceof Error ? e.message : '加载失败');
    } finally {
      setLoading(false);
    }
  }, [apiBase]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { articles, loading, error, reload };
}
