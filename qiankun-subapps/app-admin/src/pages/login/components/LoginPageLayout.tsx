import { Card, Typography } from 'antd';
import type { ReactNode } from 'react';

export interface LoginPageLayoutProps {
  children: ReactNode;
}

/** 登录页全屏布局 */
export default function LoginPageLayout({ children }: LoginPageLayoutProps) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1677ff 0%, #0958d9 100%)',
        padding: 24,
      }}
    >
      <Card
        style={{ width: 400, boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}
        bordered={false}
      >
        <Typography.Title level={3} style={{ textAlign: 'center', marginBottom: 8 }}>
          站点管理后台
        </Typography.Title>
        <Typography.Paragraph type="secondary" style={{ textAlign: 'center', marginBottom: 24 }}>
          默认账号 admin / admin123
        </Typography.Paragraph>
        {children}
      </Card>
    </div>
  );
}
