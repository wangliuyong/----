import { HomeOutlined, LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Button, Layout, Menu, Space, Typography, theme } from 'antd';
import type { MenuProps } from 'antd';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { AdminMenuNode } from '../types/rbac';
import { buildMenuItems, findDirCodeByPath, isMenuGroupKey } from '../router/menuUtils';
import { isAdminStandalone } from '../utils/runtime';

const { Header, Sider, Content } = Layout;

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

/** Ant Design 后台主布局：动态菜单侧栏 + 顶栏 + 内容区 */
export default function AdminShell({
  username,
  menus,
  currentPath,
  onNavigate,
  onLogout,
  children,
}: AdminShellProps) {
  const { token } = theme.useToken();
  const initialCollapsed = readSiderCollapsed();
  const [collapsed, setCollapsed] = useState(initialCollapsed);
  const [menuExpanded, setMenuExpanded] = useState(!initialCollapsed);
  const [openKeys, setOpenKeys] = useState<string[]>(() => [findDirCodeByPath(currentPath, menus)]);
  const savedOpenKeysRef = useRef<string[]>([findDirCodeByPath(currentPath, menus)]);
  const restoreTimerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(
    () => () => {
      if (restoreTimerRef.current) clearTimeout(restoreTimerRef.current);
    },
    [],
  );

  useEffect(() => {
    if (collapsed || !menuExpanded) return;
    const groupKey = findDirCodeByPath(currentPath, menus);
    setOpenKeys((prev) => {
      if (prev.includes(groupKey)) return prev;
      const next = [...prev, groupKey];
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

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    const keyStr = String(key);
    if (isMenuGroupKey(keyStr, menus)) return;
    onNavigate(keyStr);
  };

  const menuOpenProps: Pick<MenuProps, 'openKeys' | 'onOpenChange'> =
    collapsed || !menuExpanded
      ? {}
      : {
          openKeys,
          onOpenChange: (keys) => {
            savedOpenKeysRef.current = keys;
            setOpenKeys(keys);
          },
        };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        className="admin-shell-sider"
        collapsible
        collapsed={collapsed}
        onCollapse={handleSiderCollapse}
        trigger={null}
        width={220}
        breakpoint="lg"
        collapsedWidth={64}
        onBreakpoint={(broken) => {
          if (broken) {
            savedOpenKeysRef.current = openKeys.length > 0 ? openKeys : savedOpenKeysRef.current;
            setMenuExpanded(false);
            setCollapsed(true);
          }
        }}
        theme="dark"
        style={{ boxShadow: '2px 0 8px rgba(0,0,0,0.08)' }}
      >
        <div className="admin-shell-sider__brand">
          <span className="admin-shell-sider__brand-full">CMS 后台</span>
          <span className="admin-shell-sider__brand-mini">CMS</span>
        </div>
        <Menu
          className="admin-shell-menu"
          theme="dark"
          mode="inline"
          inlineCollapsed={collapsed}
          selectedKeys={[currentPath]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ borderInlineEnd: 0 }}
          {...menuOpenProps}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            padding: '0 24px',
            background: token.colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
          }}
        >
          <Space size="middle">
            <Button
              type="text"
              aria-label={collapsed ? '展开菜单' : '折叠菜单'}
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => handleSiderCollapse(!collapsed)}
            />
            <Typography.Text type="secondary">内容管理系统</Typography.Text>
          </Space>
          <Space size="middle">
            <Typography.Text>你好，{username}</Typography.Text>
            <Button type="link" icon={<HomeOutlined />} href={publicSiteHref} target="_blank">
              返回前台
            </Button>
            <Button type="text" danger icon={<LogoutOutlined />} onClick={onLogout}>
              退出
            </Button>
          </Space>
        </Header>

        <Content style={{ margin: 24, minHeight: 280 }}>{children}</Content>
      </Layout>
    </Layout>
  );
}
