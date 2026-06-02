import { useAdminQuery } from '../../../hooks/useAdminQuery';
import { adminApi } from '../../../utils/adminApi';
import type { SiteConfig } from '../../../types';

/** 站点配置：site / nav / about / contact 页共用 */
export function useSite() {
  const { data: site, setData: setSite, loading, error, reload } =
    useAdminQuery<SiteConfig>(adminApi.getSite);

  return { site, setSite, loading, error, reload };
}
