import { useCallback, useEffect, useState, type Dispatch, type SetStateAction } from 'react';

interface UseAdminQueryResult<T> {
  /** 服务端数据；首屏加载完成前为 null */
  data: T | null;
  /** 允许保存成功后就地更新，避免整页 reload */
  setData: Dispatch<SetStateAction<T | null>>;
  loading: boolean;
  reload: () => Promise<void>;
}

/**
 * 管理端通用数据拉取 hook
 * 加载失败由 api/client 统一 toast，此处仅维护 loading / data 状态
 */
export function useAdminQuery<T>(
  fetcher: () => Promise<T>,
): UseAdminQueryResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      setData(await fetcher());
    } catch {
      /* 错误已由 request 拦截器 toast 提示 */
    } finally {
      setLoading(false);
    }
  }, [fetcher]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { data, setData, loading, reload };
}
