import { HomeOutlined, LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { AdminMenuNode } from '../types/rbac';
import { usePageTitle } from '../context/PageTitleContext';
import { buildMenuItems, findOpenGroupKeysByPath, isMenuGroupKey } from '../router/menuUtils';
import { isAdminStandalone } from '../utils/runtime';
import { SidebarMenu, UiButton } from './ui';

const SIDER_COLLAPSED_KEY = 'admin-sider-collapsed';
const SIDER_TRANSITION_MS = 200;

function readSiderCollapsed(): boolean {
  try {
    return localStorage.getItem(SIDER_COLLAPSED_KEY) === '1';
  } catch {
    return false;
  }
}

const publicSiteHref = isAdminStandalone()
  ? (import.meta.env.VITE_PUBLIC_URL || 'http://localhost:3000')
  : '/';

interface AdminShellProps {
  username: string;
  menus: AdminMenuNode[];
  currentPath: string;
  onNavigate: (path: string) => void;
  onLogout: () => void;
  children: ReactNode;
}

/** 后台主布局：自定义侧栏 + 玻璃顶栏 + 内容区 */
export default function AdminShell({
  username,
  menus,
  currentPath,
  onNavigate,
  onLogout,
  children,
}: AdminShellProps) {
  const pageTitle = usePageTitle();
  const initialCollapsed = readSiderCollapsed();
  const [collapsed, setCollapsed] = useState(initialCollapsed);
  const [menuExpanded, setMenuExpanded] = useState(!initialCollapsed);
  const [openKeys, setOpenKeys] = useState<string[]>(() => findOpenGroupKeysByPath(currentPath, menus));
  const savedOpenKeysRef = useRef<string[]>(findOpenGroupKeysByPath(currentPath, menus));
  const restoreTimerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(
    () => () => {
      if (restoreTimerRef.current) clearTimeout(restoreTimerRef.current);
    },
    [],
  );

  useEffect(() => {
    if (collapsed || !menuExpanded) return;
    const groupKeys = findOpenGroupKeysByPath(currentPath, menus);
    setOpenKeys((prev) => {
      const next = [...prev];
      let changed = false;
      for (const key of groupKeys) {
        if (!next.includes(key)) {
          next.push(key);
          changed = true;
        }
      }
      if (!changed) return prev;
      savedOpenKeysRef.current = next;
      return next;
    });
  }, [currentPath, collapsed, menuExpanded, menus]);

  const handleSiderCollapse = (next: boolean) => {
    if (restoreTimerRef.current) {
      clearTimeout(restoreTimerRef.current);
      restoreTimerRef.current = undefined;
    }
    try {
      localStorage.setItem(SIDER_COLLAPSED_KEY, next ? '1' : '0');
    } catch {
      /* ignore */
    }
    if (next) {
      savedOpenKeysRef.current = openKeys.length > 0 ? openKeys : savedOpenKeysRef.current;
      setMenuExpanded(false);
      setCollapsed(true);
      return;
    }
    setCollapsed(false);
    restoreTimerRef.current = setTimeout(() => {
      setOpenKeys(savedOpenKeysRef.current);
      setMenuExpanded(true);
      restoreTimerRef.current = undefined;
    }, SIDER_TRANSITION_MS);
  };

  const menuItems = useMemo(() => buildMenuItems(menus), [menus]);

  const handleMenuClick = (key: string) => {
    if (isMenuGroupKey(key, menus)) return;
    onNavigate(key);
  };

  const menuOpenProps =
    collapsed || !menuExpanded
      ? { openKeys: [] as string[] }
      : {
          openKeys,
          onOpenChange: (keys: string[]) => {
            savedOpenKeysRef.current = keys;
            setOpenKeys(keys);
          },
        };

  return (
    <div className="admin-shell-root">
      <aside
        className={`admin-shell-sider${collapsed ? ' admin-shell-sider--collapsed' : ''}`}
        style={{ width: collapsed ? 64 : 220 }}
      >
        <div className="admin-shell-sider__brand">
          <span className="admin-shell-sider__brand-glow" aria-hidden />
          <span className="admin-shell-sider__brand-full">控制台</span>
          <span className="admin-shell-sider__brand-mini">控</span>
        </div>
        <SidebarMenu
          items={menuItems}
          selectedKeys={[currentPath]}
          collapsed={collapsed}
          onClick={handleMenuClick}
          {...menuOpenProps}
        />
      </aside>

      <div className="admin-shell-body">
        <header className="admin-shell-header">
          <div className="admin-shell-header__left">
            <UiButton
              variant="default"
              size="sm"
              aria-label={collapsed ? '展开菜单' : '折叠菜单'}
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => handleSiderCollapse(!collapsed)}
            />
            <div className="admin-shell-header__titles">
              <h1 className="admin-shell-header__page-title">{pageTitle}</h1>
            </div>
          </div>
          <div className="admin-shell-header__actions">
            <span className="admin-shell-header__user">你好，{username}</span>
            <UiButton variant="ghost" size="sm" icon={<HomeOutlined />} href={publicSiteHref} target="_blank">
              返回前台
            </UiButton>
            <UiButton variant="default" size="sm" icon={<LogoutOutlined />} onClick={onLogout}>
              退出
            </UiButton>
          </div>
        </header>

        <main className="admin-shell-content">{children}</main>
      </div>
    </div>
  );
}
