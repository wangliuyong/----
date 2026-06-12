import { GlobalOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Tabs } from 'antd';
import { AdminPageShell, AdminSectionCard } from '../../../components/admin-page';
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
      <AdminPageShell title="站点配置" description="加载失败，请重试">
        <AdminSectionCard>
          <Button type="primary" onClick={() => void reload()}>
            重新加载
          </Button>
        </AdminSectionCard>
      </AdminPageShell>
    );
  }

  const navCount = site.nav?.length ?? 0;

  return (
    <AdminPageShell
      title="站点配置"
      description="站点基础信息、导航、关于与联系方式，变更将同步至前台展示"
      stats={[
        {
          label: '站点名称',
          value: site.siteName || '未设置',
          icon: <GlobalOutlined />,
          accent: 'primary',
        },
        {
          label: '导航项',
          value: navCount,
          icon: <SettingOutlined />,
          hint: '前台顶部导航',
        },
      ]}
    >
      <AdminSectionCard>
        <Tabs
          defaultActiveKey="basic"
          items={[
            {
              key: 'basic',
              label: '站点设置',
              children: <SiteBasicSettingsSection site={site} setSite={setSite} />,
            },
            {
              key: 'nav',
              label: '导航管理',
              children: <SiteNavSettingsSection site={site} setSite={setSite} />,
            },
            {
              key: 'about',
              label: '关于我',
              children: <SiteAboutSettingsSection site={site} setSite={setSite} />,
            },
            {
              key: 'contact',
              label: '联系我',
              children: <SiteContactSettingsSection site={site} setSite={setSite} />,
            },
          ]}
        />
      </AdminSectionCard>
    </AdminPageShell>
  );
}
