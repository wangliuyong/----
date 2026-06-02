import { NavPanel } from '../../components/AdminPanels';
import { adminApi } from '../../utils/adminApi';
import type { NavPageProps } from './types';

/** /admin/nav — 顶栏导航项 */
export default function NavPage({ apiBase, site, onSiteUpdate }: NavPageProps) {
  if (!site) return null;

  return (
    <NavPanel
      nav={site.nav}
      onSave={async (nav) => {
        onSiteUpdate(await adminApi.updateNav(apiBase, nav));
      }}
    />
  );
}
