import {
  LockOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Alert, Button, Card, Form, Input, Typography } from 'antd';
import { useState } from 'react';
import { login } from '../utils/adminApi';
import { saveAuth } from '../utils/auth';

interface LoginPageProps {
  apiBase: string;
  onSuccess: (username: string) => void;
}

/** Ant Design 登录页（全屏居中） */
export default function LoginPage({ apiBase, onSuccess }: LoginPageProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);
    setError('');
    try {
      const res = await login(apiBase, values.username, values.password);
      saveAuth(res.accessToken, res.username);
      onSuccess(res.username);
    } catch {
      setError('用户名或密码错误');
    } finally {
      setLoading(false);
    }
  };

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

        {error && (
          <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />
        )}

        <Form
          layout="vertical"
          initialValues={{ username: 'admin' }}
          onFinish={onFinish}
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="用户名" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
