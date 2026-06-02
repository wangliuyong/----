import type { SiteConfig } from '../../types';

/** /admin/about 页面入参 */
export interface AboutPageProps {
  apiBase: string;
  site: SiteConfig | null;
  onSiteUpdate: (site: SiteConfig) => void;
}
