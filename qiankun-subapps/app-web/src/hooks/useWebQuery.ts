import { useCallback, useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import { useApiBase } from '../context/ApiBaseContext';

interface UseWebQueryResult<T> {
  data: T | null;
  setData: Dispatch<SetStateAction<T | null>>;
  loading: boolean;
  error: string;
  reload: () => Promise<void>;
}

/**
 * 前台通用数据拉取 hook
 * 统一 loading / error / 竞态安全 reload，各 feature hook 在此之上做语义别名
 */
export function useWebQuery<T>(
  fetcher: (apiBase: string) => Promise<T>,
  /** 自定义错误文案，默认「加载失败」 */
  errorMessage = '加载失败',
): UseWebQueryResult<T> {
  const apiBase = useApiBase();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setData(await fetcher(apiBase));
    } catch {
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [apiBase, errorMessage, fetcher]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { data, setData, loading, error, reload };
}
