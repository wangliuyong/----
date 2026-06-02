import { HomeOutlined, LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Button, Layout, Menu, Space, Typography, theme } from 'antd';
import type { MenuProps } from 'antd';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  ADMIN_MENU_GROUPS,
  ADMIN_TABS,
  findMenuGroupKeyByTab,
  type AdminTab,
} from '../router/adminTabs';
import { isAdminStandalone } from '../utils/runtime';

const { Header, Sider, Content } = Layout;

const SIDER_COLLAPSED_KEY = 'admin-sider-collapsed';
/** 与 Ant Design Sider 默认宽度过渡时长一致 */
const SIDER_TRANSITION_MS = 200;

/** 读取侧栏折叠偏好（本地持久化） */
function readSiderCollapsed(): boolean {
  try {
    return localStorage.getItem(SIDER_COLLAPSED_KEY) === '1';
  } catch {
    return false;
  }
}

/** 独立运行时「返回前台」指向基座地址，否则为 / */
const publicSiteHref = isAdminStandalone()
  ? (import.meta.env.VITE_PUBLIC_URL || 'http://localhost:3000')
  : '/';

interface AdminShellProps {
  username: string;
  tab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  onLogout: () => void;
  children: ReactNode;
}

/** Ant Design 后台主布局：深色侧栏 + 顶栏 + 内容区 */
export default function AdminShell({
  username,
  tab,
  onTabChange,
  onLogout,
  children,
}: AdminShellProps) {
  const { token } = theme.useToken();
  const initialCollapsed = readSiderCollapsed();

  /** 侧栏折叠：窄屏仅图标，悬停弹出子菜单 */
  const [collapsed, setCollapsed] = useState(initialCollapsed);
  /**
   * 展开动画结束后再恢复 inline SubMenu 的 openKeys，
   * 避免侧栏变宽过程中子菜单在窄宽度下闪动
   */
  const [menuExpanded, setMenuExpanded] = useState(!initialCollapsed);

  /** 当前展开的分组；切换路由时自动展开所属分类 */
  const [openKeys, setOpenKeys] = useState<string[]>(() =>
    initialCollapsed ? [] : [findMenuGroupKeyByTab(tab)],
  );

  const savedOpenKeysRef = useRef<string[]>([findMenuGroupKeyByTab(tab)]);
  const restoreTimerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(
    () => () => {
      if (restoreTimerRef.current) clearTimeout(restoreTimerRef.current);
    },
    [],
  );

  useEffect(() => {
    if (collapsed || !menuExpanded) return;
    const groupKey = findMenuGroupKeyByTab(tab);
    setOpenKeys((prev) => {
      if (prev.includes(groupKey)) return prev;
      const next = [...prev, groupKey];
      savedOpenKeysRef.current = next;
      return next;
    });
  }, [tab, collapsed, menuExpanded]);

  const handleOpenChange: MenuProps['onOpenChange'] = (keys) => {
    savedOpenKeysRef.current = keys;
    setOpenKeys(keys);
  };

  const handleSiderCollapse = (next: boolean) => {
    if (restoreTimerRef.current) {
      clearTimeout(restoreTimerRef.current);
      restoreTimerRef.current = undefined;
    }

    try {
      localStorage.setItem(SIDER_COLLAPSED_KEY, next ? '1' : '0');
    } catch {
      // 忽略隐私模式等无法写入 localStorage 的场景
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

  /** SubMenu 结构：一级分组带 icon，侧栏折叠时展示分组图标 */
  const menuItems: MenuProps['items'] = useMemo(
    () =>
      ADMIN_MENU_GROUPS.map((group) => ({
        key: group.key,
        icon: <group.Icon />,
        label: group.label,
        children: group.items.map(({ key, label, Icon }) => ({
          key,
          icon: <Icon />,
          label,
        })),
      })),
    [],
  );

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (ADMIN_TABS.includes(key as AdminTab)) {
      onTabChange(key as AdminTab);
    }
  };

  /** 折叠态或宽度过渡中不控制 openKeys，避免与 inlineCollapsed 冲突导致闪烁 */
  const menuOpenProps: Pick<MenuProps, 'openKeys' | 'onOpenChange'> =
    collapsed || !menuExpanded
      ? {}
      : { openKeys, onOpenChange: handleOpenChange };

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
          selectedKeys={[tab]}
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

        <Content style={{ margin: 24, minHeight: 280 }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
