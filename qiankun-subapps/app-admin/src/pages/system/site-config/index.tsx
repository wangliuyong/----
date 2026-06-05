import { Button, Card, Tabs } from 'antd';
import PageLoading from '../../../components/_common/PageLoading';
import SiteAboutSettingsSection from './components/SiteAboutSettingsSection';
import SiteBasicSettingsSection from './components/SiteBasicSettingsSection';
import SiteContactSettingsSection from './components/SiteContactSettingsSection';
import SiteNavSettingsSection from './components/SiteNavSettingsSection';
import { useSite } from './hooks/useSite';

/** 路由 system/site-config — 站点名称、导航、关于、联系配置 */
export default function SiteConfigPage() {
  const { site, setSite, loading, reload } = useSite();

  if (loading) return <PageLoading />;

  if (!site) {
    return (
      <Card title="站点配置">
        <Button type="primary" onClick={() => void reload()}>
          重新加载
        </Button>
      </Card>
    );
  }

  return (
    <Card title="站点配置">
      <Tabs
        defaultActiveKey="basic"
        items={[
          {
            key: 'basic',
            label: '站点设置',
            children: (
              <SiteBasicSettingsSection site={site} setSite={setSite} />
            ),
          },
          {
            key: 'nav',
            label: '导航管理',
            children: <SiteNavSettingsSection site={site} setSite={setSite} />,
          },
          {
            key: 'about',
            label: '关于我',
            children: (
              <SiteAboutSettingsSection site={site} setSite={setSite} />
            ),
          },
          {
            key: 'contact',
            label: '联系我',
            children: (
              <SiteContactSettingsSection site={site} setSite={setSite} />
            ),
          },
        ]}
      />
    </Card>
  );
}
