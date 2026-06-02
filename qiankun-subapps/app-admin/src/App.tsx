import { Alert, ConfigProvider, theme } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname } from '../../_shared/hooks';
import AdminShell from './components/AdminShell';
import CachedPanel from './components/CachedPanel';
import {
  AboutPage,
  ArticlesPage,
  ContactPage,
  LoginPage,
  MessagesPage,
  NavPage,
  PageLoading,
  ProjectsPage,
  SitePage,
} from './pages';
import {
  ADMIN_TABS,
  SITE_DATA_TABS,
  adminTabPath,
  navigateAdminTab,
  normalizeAdminPathname,
  resolveAdminTab,
} from './routes';
import type { AdminTab, Article, Project, SiteConfig } from './types';
import { adminApi } from './utils/adminApi';
import { clearAuth, getUsername, isLoggedIn } from './utils/auth';

interface AppProps {
  apiBase: string;
}

/**
 * 管理后台主应用
 * - 基座 pathname（/admin/:tab）驱动侧栏与内容区
 * - 各 Tab 页面在 pages/ 目录，CachedPanel 缓存已访问页面
 */
export default function App({ apiBase }: AppProps) {
  const pathname = usePathname();
  const tab = useMemo(() => resolveAdminTab(pathname), [pathname]);

  const [loggedIn, setLoggedIn] = useState(isLoggedIn());
  const [username, setUsername] = useState(getUsername() || '');
  const [site, setSite] = useState<SiteConfig | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<
    Awaited<ReturnType<typeof adminApi.listMessages>>
  >([]);
  const [error, setError] = useState('');
  const [loadingTab, setLoadingTab] = useState<AdminTab | null>(null);

  const [visitedTabs, setVisitedTabs] = useState<Set<AdminTab>>(
    () => new Set<AdminTab>([tab]),
  );
  const loadedTabsRef = useRef<Set<AdminTab>>(new Set());

  useEffect(() => {
    normalizeAdminPathname(pathname);
  }, [pathname]);

  useEffect(() => {
    setVisitedTabs((prev) => {
      if (prev.has(tab)) return prev;
      const next = new Set(prev);
      next.add(tab);
      return next;
    });
  }, [tab]);

  const loadTabData = useCallback(
    async (target: AdminTab, force = false) => {
      if (!isLoggedIn()) return;

      const siteReady = loadedTabsRef.current.has('site');

      if (!force) {
        if (SITE_DATA_TABS.includes(target) && siteReady) return;
        if (target === 'articles' && loadedTabsRef.current.has('articles')) return;
        if (target === 'projects' && loadedTabsRef.current.has('projects')) return;
        if (target === 'messages' && loadedTabsRef.current.has('messages')) return;
      }

      setLoadingTab(target);
      setError('');

      try {
        if (SITE_DATA_TABS.includes(target) && (force || !siteReady)) {
          const cfg = await adminApi.getSite(apiBase);
          setSite(cfg);
          SITE_DATA_TABS.forEach((t) => loadedTabsRef.current.add(t));
        }
        if (target === 'articles' && (force || !loadedTabsRef.current.has('articles'))) {
          setArticles(await adminApi.listArticles(apiBase));
          loadedTabsRef.current.add('articles');
        }
        if (target === 'projects' && (force || !loadedTabsRef.current.has('projects'))) {
          setProjects(await adminApi.listProjects(apiBase));
          loadedTabsRef.current.add('projects');
        }
        if (target === 'messages' && (force || !loadedTabsRef.current.has('messages'))) {
          setMessages(await adminApi.listMessages(apiBase));
          loadedTabsRef.current.add('messages');
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : '加载失败');
        if (String(e).includes('登录')) setLoggedIn(false);
      } finally {
        setLoadingTab((current) => (current === target ? null : current));
      }
    },
    [apiBase],
  );

  useEffect(() => {
    if (loggedIn) void loadTabData(tab);
  }, [loggedIn, tab, loadTabData]);

  const handleLoginSuccess = (name: string) => {
    setUsername(name);
    setLoggedIn(true);
    loadedTabsRef.current.clear();
    setVisitedTabs(new Set([tab]));
    if (window.location.pathname !== adminTabPath(tab)) {
      history.replaceState(null, '', adminTabPath(tab));
    }
  };

  const handleLogout = () => {
    clearAuth();
    setLoggedIn(false);
    setSite(null);
    loadedTabsRef.current.clear();
    setVisitedTabs(new Set(['site']));
  };

  const refreshTab = useCallback(
    (target: AdminTab) => {
      void loadTabData(target, true);
    },
    [loadTabData],
  );

  /** 渲染 pages/ 下对应路由页面 */
  const renderAdminPage = (panelTab: AdminTab) => {
    if (loadingTab === panelTab) return <PageLoading />;

    switch (panelTab) {
      case 'site':
        return (
          <SitePage apiBase={apiBase} site={site} onSiteUpdate={setSite} />
        );
      case 'nav':
        return (
          <NavPage apiBase={apiBase} site={site} onSiteUpdate={setSite} />
        );
      case 'articles':
        return (
          <ArticlesPage
            apiBase={apiBase}
            articles={articles}
            onRefresh={() => refreshTab('articles')}
          />
        );
      case 'projects':
        return (
          <ProjectsPage
            apiBase={apiBase}
            projects={projects}
            onRefresh={() => refreshTab('projects')}
          />
        );
      case 'about':
        return (
          <AboutPage apiBase={apiBase} site={site} onSiteUpdate={setSite} />
        );
      case 'contact':
        return (
          <ContactPage apiBase={apiBase} site={site} onSiteUpdate={setSite} />
        );
      case 'messages':
        return (
          <MessagesPage
            apiBase={apiBase}
            messages={messages}
            onRefresh={() => refreshTab('messages')}
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
          onTabChange={navigateAdminTab}
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
          {ADMIN_TABS.map((panelTab) => (
            <CachedPanel
              key={panelTab}
              tab={panelTab}
              activeTab={tab}
              visited={visitedTabs}
            >
              {renderAdminPage(panelTab)}
            </CachedPanel>
          ))}
        </AdminShell>
      )}
    </ConfigProvider>
  );
}
