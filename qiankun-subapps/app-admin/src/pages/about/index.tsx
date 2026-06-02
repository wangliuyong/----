import { AboutPanel } from '../../components/AdminPanels';
import PageError from '../../components/PageError';
import { useApiBase } from '../../context/ApiBaseContext';
import { useSite } from '../../hooks/useSite';
import PageLoading from '../_common/PageLoading';
import { adminApi } from '../../utils/adminApi';

/** 路由 /about — 关于页 Profile */
export default function AboutPage() {
  const apiBase = useApiBase();
  const { site, setSite, loading, error } = useSite();

  if (loading) return <PageLoading />;
  if (!site) {
    return <PageError message={error || '站点配置加载失败'} />;
  }

  return (
    <>
      <PageError message={error} />
      <AboutPanel
        about={site.about}
        onSave={async (about) => {
          setSite(await adminApi.updateAbout(apiBase, about));
        }}
      />
    </>
  );
}
