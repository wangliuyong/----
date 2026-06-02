import {
  CommentOutlined,
  FileTextOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  LogoutOutlined,
  MailOutlined,
  MenuOutlined,
  ProjectOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, Space, Typography, theme } from 'antd';
import type { MenuProps } from 'antd';
import type { ReactNode } from 'react';
import type { AdminTab } from '../types';
import { isAdminStandalone } from '../utils/runtime';

const { Header, Sider, Content } = Layout;

/** 独立运行时「返回前台」指向基座地址，否则为 / */
const publicSiteHref = isAdminStandalone()
  ? (import.meta.env.VITE_PUBLIC_URL || 'http://localhost:3000')
  : '/';

const MENU_ITEMS: { key: AdminTab; icon: ReactNode; label: string }[] = [
  { key: 'site', icon: <SettingOutlined />, label: '站点设置' },
  { key: 'nav', icon: <MenuOutlined />, label: '导航管理' },
  { key: 'articles', icon: <FileTextOutlined />, label: '博客管理' },
  { key: 'projects', icon: <ProjectOutlined />, label: '项目管理' },
  { key: 'about', icon: <InfoCircleOutlined />, label: '关于我' },
  { key: 'contact', icon: <MailOutlined />, label: '联系我' },
  { key: 'messages', icon: <CommentOutlined />, label: '留言管理' },
];

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

  const menuItems: MenuProps['items'] = MENU_ITEMS.map((item) => ({
    key: item.key,
    icon: item.icon,
    label: item.label,
  }));

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        breakpoint="lg"
        collapsedWidth={64}
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
            fontSize: 16,
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          CMS 后台
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[tab]}
          items={menuItems}
          onClick={({ key }) => onTabChange(key as AdminTab)}
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
          <Typography.Text type="secondary">内容管理系统</Typography.Text>
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
