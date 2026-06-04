import { Button, Card } from 'antd';
import PageLoading from '../../components/_common/PageLoading';
import SiteSettingsForm from './components/SiteSettingsForm';
import { useSiteSettingsPage } from './hooks/useSiteSettingsPage';

/** 路由 site — 站点基础信息 */
export default function SitePage() {
  const page = useSiteSettingsPage();

  if (page.loading) return <PageLoading />;
  if (!page.site) {
    return (
      <Card title="站点设置">
        <Button type="primary" onClick={() => void page.reload()}>
          重新加载
        </Button>
      </Card>
    );
  }

  return (
    <Card title="站点设置">
      <SiteSettingsForm
        form={page.form}
        saving={page.saving}
        onSubmit={page.handleSubmit}
      />
    </Card>
  );
}
