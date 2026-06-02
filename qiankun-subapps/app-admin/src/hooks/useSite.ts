import { useCallback, useEffect, useState } from 'react';
import type { SiteConfig } from '../types';
import { adminApi } from '../utils/adminApi';
import { useApiBase } from '../context/ApiBaseContext';

/** 站点配置：site / nav / about / contact 等页共用 */
export function useSite() {
  const apiBase = useApiBase();
  const [site, setSite] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setSite(await adminApi.getSite(apiBase));
    } catch (e) {
      setError(e instanceof Error ? e.message : '加载失败');
    } finally {
      setLoading(false);
    }
  }, [apiBase]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { site, setSite, loading, error, reload };
}
