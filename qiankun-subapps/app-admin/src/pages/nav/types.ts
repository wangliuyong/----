import type { SiteConfig } from '../../types';

/** /admin/nav 页面入参 */
export interface NavPageProps {
  apiBase: string;
  site: SiteConfig | null;
  onSiteUpdate: (site: SiteConfig) => void;
}
