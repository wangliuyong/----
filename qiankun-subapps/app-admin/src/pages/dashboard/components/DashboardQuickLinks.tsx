import {
  BugOutlined,
  CommentOutlined,
  FileTextOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Button, Card, Space } from 'antd';

interface DashboardQuickLinksProps {
  onNavigate: (path: string) => void;
}

/** 常用管理入口快捷跳转 */
export default function DashboardQuickLinks({ onNavigate }: DashboardQuickLinksProps) {
  const links = [
    { path: 'articles', label: '博客管理', icon: <FileTextOutlined /> },
    { path: 'messages', label: '留言管理', icon: <CommentOutlined /> },
    { path: 'system/site-config', label: '站点配置', icon: <SettingOutlined /> },
    { path: 'logs/app', label: '错误日志', icon: <BugOutlined /> },
  ];

  return (
    <Card title="快捷入口" bordered={false} className="dashboard-panel">
      <Space wrap size="middle">
        {links.map((link) => (
          <Button
            key={link.path}
            icon={link.icon}
            onClick={() => onNavigate(link.path)}
          >
            {link.label}
          </Button>
        ))}
      </Space>
    </Card>
  );
}
