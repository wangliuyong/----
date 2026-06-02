import { ContactPanel } from '../../components/AdminPanels';
import PageError from '../../components/PageError';
import { useApiBase } from '../../context/ApiBaseContext';
import { useSite } from '../../hooks/useSite';
import PageLoading from '../_common/PageLoading';
import { adminApi } from '../../utils/adminApi';

/** 路由 /contact — 联系页文案与邮箱 */
export default function ContactPage() {
  const apiBase = useApiBase();
  const { site, setSite, loading, error } = useSite();

  if (loading) return <PageLoading />;
  if (!site) {
    return <PageError message={error || '站点配置加载失败'} />;
  }

  return (
    <>
      <PageError message={error} />
      <ContactPanel
        site={site}
        onSave={async (contact, email, githubUrl) => {
          setSite(await adminApi.updateContact(apiBase, contact, email, githubUrl));
        }}
      />
    </>
  );
}
