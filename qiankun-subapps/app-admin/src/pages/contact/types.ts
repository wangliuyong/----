import type { SiteConfig } from '../../types';

/** /admin/contact 页面入参 */
export interface ContactPageProps {
  apiBase: string;
  site: SiteConfig | null;
  onSiteUpdate: (site: SiteConfig) => void;
}
