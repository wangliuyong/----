import { useCallback, useEffect, useState, type Dispatch, type SetStateAction } from 'react';

interface UseAdminQueryResult<T> {
  /** 服务端数据；首屏加载完成前为 null */
  data: T | null;
  /** 允许保存成功后就地更新，避免整页 reload */
  setData: Dispatch<SetStateAction<T | null>>;
  loading: boolean;
  error: string;
  reload: () => Promise<void>;
}

/**
 * 管理端通用数据拉取 hook
 * 统一 loading / error / 竞态安全 reload，各 feature hook 在此之上做语义别名
 */
export function useAdminQuery<T>(
  fetcher: () => Promise<T>,
): UseAdminQueryResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setData(await fetcher());
    } catch (e) {
      setError(e instanceof Error ? e.message : '加载失败');
    } finally {
      setLoading(false);
    }
  }, [fetcher]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { data, setData, loading, error, reload };
}
