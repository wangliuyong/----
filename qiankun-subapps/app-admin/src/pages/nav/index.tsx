import { NavPanel } from '../../components/AdminPanels';
import PageError from '../../components/PageError';
import { useApiBase } from '../../context/ApiBaseContext';
import { useSite } from '../../hooks/useSite';
import PageLoading from '../_common/PageLoading';
import { adminApi } from '../../utils/adminApi';

/** 路由 /nav — 顶栏导航项 */
export default function NavPage() {
  const apiBase = useApiBase();
  const { site, setSite, loading, error } = useSite();

  if (loading) return <PageLoading />;
  if (!site) {
    return <PageError message={error || '站点配置加载失败'} />;
  }

  return (
    <>
      <PageError message={error} />
      <NavPanel
        nav={site.nav}
        onSave={async (nav) => {
          setSite(await adminApi.updateNav(apiBase, nav));
        }}
      />
    </>
  );
}
