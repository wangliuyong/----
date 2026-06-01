import { Alert, ConfigProvider, Spin, theme } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { useCallback, useEffect, useState } from 'react';
import AdminShell from './components/AdminShell';
import {
  AboutPanel,
  ArticlesPanel,
  ContactPanel,
  MessagesPanel,
  NavPanel,
  ProjectsPanel,
  SiteSettingsPanel,
} from './components/AdminPanels';
import LoginPage from './components/LoginPage';
import type { AdminTab, Article, Project, SiteConfig } from './types';
import { adminApi } from './utils/adminApi';
import { clearAuth, getUsername, isLoggedIn } from './utils/auth';

interface AppProps {
  apiBase: string;
}

/**
 * 管理后台主应用
 * - 使用 Ant Design ConfigProvider 独立主题，不依赖主站 Tailwind / dark mode
 * - 登录后进入 AdminShell 侧栏布局
 */
export default function App({ apiBase }: AppProps) {
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());
  const [username, setUsername] = useState(getUsername() || '');
  const [tab, setTab] = useState<AdminTab>('site');
  const [site, setSite] = useState<SiteConfig | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<
    Awaited<ReturnType<typeof adminApi.listMessages>>
  >([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  /** 按当前 Tab 拉取所需数据 */
  const loadTabData = useCallback(async () => {
    if (!isLoggedIn()) return;
    setLoading(true);
    setError('');
    try {
      if (tab === 'site' || tab === 'nav' || tab === 'about' || tab === 'contact') {
        const cfg = await adminApi.getSite(apiBase);
        setSite(cfg);
      }
      if (tab === 'articles') setArticles(await adminApi.listArticles(apiBase));
      if (tab === 'projects') setProjects(await adminApi.listProjects(apiBase));
      if (tab === 'messages') setMessages(await adminApi.listMessages(apiBase));
    } catch (e) {
      setError(e instanceof Error ? e.message : '加载失败');
      if (String(e).includes('登录')) setLoggedIn(false);
    } finally {
      setLoading(false);
    }
  }, [apiBase, tab]);

  useEffect(() => {
    if (loggedIn) void loadTabData();
  }, [loggedIn, loadTabData]);

  const handleLoginSuccess = (name: string) => {
    setUsername(name);
    setLoggedIn(true);
  };

  const handleLogout = () => {
    clearAuth();
    setLoggedIn(false);
    setSite(null);
  };

  /** 渲染当前 Tab 对应的管理面板 */
  const renderPanel = () => {
    if (loading) {
      return (
        <div style={{ textAlign: 'center', padding: 48 }}>
          <Spin tip="加载中..." />
        </div>
      );
    }

    switch (tab) {
      case 'site':
        return site ? (
          <SiteSettingsPanel
            site={site}
            onSave={async (data) => {
              const updated = await adminApi.updateSite(apiBase, data);
              setSite(updated);
            }}
          />
        ) : null;
      case 'nav':
        return site ? (
          <NavPanel
            nav={site.nav}
            onSave={async (nav) => {
              const updated = await adminApi.updateNav(apiBase, nav);
              setSite(updated);
            }}
          />
        ) : null;
      case 'articles':
        return (
          <ArticlesPanel
            apiBase={apiBase}
            articles={articles}
            onRefresh={loadTabData}
          />
        );
      case 'projects':
        return (
          <ProjectsPanel
            apiBase={apiBase}
            projects={projects}
            onRefresh={loadTabData}
          />
        );
      case 'about':
        return site ? (
          <AboutPanel
            about={site.about}
            onSave={async (about) => {
              const updated = await adminApi.updateAbout(apiBase, about);
              setSite(updated);
            }}
          />
        ) : null;
      case 'contact':
        return site ? (
          <ContactPanel
            site={site}
            onSave={async (contact, email, githubUrl) => {
              const updated = await adminApi.updateContact(
                apiBase,
                contact,
                email,
                githubUrl,
              );
              setSite(updated);
            }}
          />
        ) : null;
      case 'messages':
        return (
          <MessagesPanel
            apiBase={apiBase}
            messages={messages}
            onRefresh={loadTabData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 6,
        },
      }}
    >
      {!loggedIn ? (
        <LoginPage apiBase={apiBase} onSuccess={handleLoginSuccess} />
      ) : (
        <AdminShell
          username={username}
          tab={tab}
          onTabChange={setTab}
          onLogout={handleLogout}
        >
          {error && (
            <Alert
              type="error"
              message={error}
              showIcon
              closable
              onClose={() => setError('')}
              style={{ marginBottom: 16 }}
            />
          )}
          {renderPanel()}
        </AdminShell>
      )}
    </ConfigProvider>
  );
}
