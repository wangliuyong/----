import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, Button, Form, Input } from 'antd';
import type { LoginFormValues } from '../types';

export interface LoginFormProps {
  loading: boolean;
  error: string;
  onFinish: (values: LoginFormValues) => void;
}

/** 管理后台登录表单 */
export default function LoginForm({ loading, error, onFinish }: LoginFormProps) {
  return (
    <>
      {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}
      <Form
        layout="vertical"
        initialValues={{ username: 'admin' }}
        onFinish={onFinish}
        size="large"
      >
        <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}>
          <Input prefix={<UserOutlined />} placeholder="用户名" />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
          <Input.Password prefix={<LockOutlined />} placeholder="密码" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            登录
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
