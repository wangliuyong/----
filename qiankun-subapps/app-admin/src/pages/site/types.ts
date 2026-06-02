import type { SiteConfig } from '../../types';

/** /admin/site 页面入参 */
export interface SitePageProps {
  apiBase: string;
  site: SiteConfig | null;
  onSiteUpdate: (site: SiteConfig) => void;
}
