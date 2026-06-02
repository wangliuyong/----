import { AboutPanel } from '../../components/AdminPanels';
import { adminApi } from '../../utils/adminApi';
import type { AboutPageProps } from './types';

/** /admin/about — 关于页 Profile */
export default function AboutPage({ apiBase, site, onSiteUpdate }: AboutPageProps) {
  if (!site) return null;

  return (
    <AboutPanel
      about={site.about}
      onSave={async (about) => {
        onSiteUpdate(await adminApi.updateAbout(apiBase, about));
      }}
    />
  );
}
