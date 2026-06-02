import { SiteSettingsPanel } from '../../components/AdminPanels';
import { adminApi } from '../../utils/adminApi';
import type { SitePageProps } from './types';

/** /admin/site — 站点基础信息 */
export default function SitePage({ apiBase, site, onSiteUpdate }: SitePageProps) {
  if (!site) return null;

  return (
    <SiteSettingsPanel
      site={site}
      onSave={async (data) => {
        onSiteUpdate(await adminApi.updateSite(apiBase, data));
      }}
    />
  );
}
