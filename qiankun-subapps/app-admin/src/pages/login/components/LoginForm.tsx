import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, Button, Form, Input } from 'antd';
import type { LoginFormValues } from '../types';

export interface LoginFormProps {
  loading: boolean;
  error: string;
  onFinish: (values: LoginFormValues) => void;
}

/** 管理后台登录表单（Ant Design，标签置于输入框上方） */
export default function LoginForm({ loading, error, onFinish }: LoginFormProps) {
  return (
    <>
      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          role="alert"
          style={{ marginBottom: 20 }}
        />
      )}

      <Form
        layout="vertical"
        initialValues={{ username: 'admin' }}
        onFinish={onFinish}
        size="large"
        requiredMark={false}
      >
        <Form.Item
          label="用户名"
          name="username"
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="管理员用户名"
            autoComplete="username"
            disabled={loading}
          />
        </Form.Item>

        <Form.Item
          label="密码"
          name="password"
          rules={[{ required: true, message: '请输入密码' }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="登录密码"
            autoComplete="current-password"
            disabled={loading}
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, marginTop: 8 }}>
          <Button type="primary" htmlType="submit" block loading={loading}>
            登录
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
