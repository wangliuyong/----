import { HomeOutlined, LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Button, Layout, Menu, Space, Typography, theme } from 'antd';
import type { MenuProps } from 'antd';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  ADMIN_MENU_GROUPS,
  ADMIN_TABS,
  findMenuGroupKeyByTab,
  type AdminTab,
} from '../router/adminTabs';
import { isAdminStandalone } from '../utils/runtime';

const { Header, Sider, Content } = Layout;

const SIDER_COLLAPSED_KEY = 'admin-sider-collapsed';

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

  /** 侧栏折叠：窄屏仅图标，悬停弹出子菜单 */
  const [collapsed, setCollapsed] = useState(readSiderCollapsed);

  /** 当前展开的分组；切换路由时自动展开所属分类 */
  const [openKeys, setOpenKeys] = useState<string[]>(() => [findMenuGroupKeyByTab(tab)]);

  useEffect(() => {
    if (collapsed) return;
    const groupKey = findMenuGroupKeyByTab(tab);
    setOpenKeys((prev) => (prev.includes(groupKey) ? prev : [...prev, groupKey]));
  }, [tab, collapsed]);

  const handleSiderCollapse = (next: boolean) => {
    setCollapsed(next);
    try {
      localStorage.setItem(SIDER_COLLAPSED_KEY, next ? '1' : '0');
    } catch {
      // 忽略隐私模式等无法写入 localStorage 的场景
    }
    if (next) {
      setOpenKeys([]);
    } else {
      setOpenKeys([findMenuGroupKeyByTab(tab)]);
    }
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

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={handleSiderCollapse}
        trigger={null}
        width={220}
        breakpoint="lg"
        collapsedWidth={64}
        onBreakpoint={(broken) => {
          // 小屏自动收拢侧栏，避免占用过多横向空间
          if (broken) {
            setCollapsed(true);
            setOpenKeys([]);
          }
        }}
        theme="dark"
        style={{ boxShadow: '2px 0 8px rgba(0,0,0,0.08)' }}
      >
        <div
          style={{
            height: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 600,
            fontSize: collapsed ? 14 : 16,
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}
        >
          {collapsed ? 'CMS' : 'CMS 后台'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          inlineCollapsed={collapsed}
          selectedKeys={[tab]}
          openKeys={openKeys}
          onOpenChange={setOpenKeys}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ borderInlineEnd: 0 }}
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
