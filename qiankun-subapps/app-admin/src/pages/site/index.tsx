import { SiteSettingsPanel } from '../../components/AdminPanels';
import PageError from '../../components/PageError';
import { useApiBase } from '../../context/ApiBaseContext';
import { useSite } from '../../hooks/useSite';
import PageLoading from '../_common/PageLoading';
import { adminApi } from '../../utils/adminApi';

/** 路由 /site — 站点基础信息 */
export default function SitePage() {
  const apiBase = useApiBase();
  const { site, setSite, loading, error } = useSite();

  if (loading) return <PageLoading />;
  if (!site) {
    return <PageError message={error || '站点配置加载失败'} />;
  }

  return (
    <>
      <PageError message={error} />
      <SiteSettingsPanel
        site={site}
        onSave={async (data) => {
          setSite(await adminApi.updateSite(apiBase, data));
        }}
      />
    </>
  );
}
