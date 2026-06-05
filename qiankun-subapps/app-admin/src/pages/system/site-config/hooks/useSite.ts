import { getSite } from '../../../../api/site.api';
import { useAdminQuery } from '../../../../hooks/useAdminQuery';
import type { SiteConfig } from '../../../../types';

/** 站点配置页：拉取与缓存 SiteConfig（供各 Tab 分区共用） */
export function useSite() {
  const { data: site, setData: setSite, loading, reload } =
    useAdminQuery<SiteConfig>(getSite);

  return { site, setSite, loading, reload };
}
