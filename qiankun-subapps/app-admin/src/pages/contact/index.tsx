import { ContactPanel } from '../../components/AdminPanels';
import { adminApi } from '../../utils/adminApi';
import type { ContactPageProps } from './types';

/** /admin/contact — 联系页文案与邮箱 */
export default function ContactPage({ apiBase, site, onSiteUpdate }: ContactPageProps) {
  if (!site) return null;

  return (
    <ContactPanel
      site={site}
      onSave={async (contact, email, githubUrl) => {
        onSiteUpdate(await adminApi.updateContact(apiBase, contact, email, githubUrl));
      }}
    />
  );
}
