import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useState, type FormEvent } from 'react';
import type { LoginFormValues } from '../types';
import { UiAlert, UiButton, UiInput, UiPassword } from '../../../components/ui';

export interface LoginFormProps {
  loading: boolean;
  error: string;
  onFinish: (values: LoginFormValues) => void;
}

/** 管理后台登录表单 */
export default function LoginForm({ loading, error, onFinish }: LoginFormProps) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ username?: string; password?: string }>({});

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const nextErrors: typeof fieldErrors = {};
    if (!username.trim()) nextErrors.username = '请输入用户名';
    if (!password) nextErrors.password = '请输入密码';
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    onFinish({ username: username.trim(), password });
  };

  return (
    <form className="admin-login-form" onSubmit={handleSubmit} noValidate>
      {error ? <UiAlert type="error" message={error} className="admin-login-form__alert" /> : null}

      <div className={`admin-login-form__field${fieldErrors.username ? ' admin-login-form__field--error' : ''}`}>
        <label className="admin-login-form__label" htmlFor="login-username">
          用户名
        </label>
        <UiInput
          id="login-username"
          prefix={<UserOutlined />}
          placeholder="管理员用户名"
          autoComplete="username"
          disabled={loading}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        {fieldErrors.username ? <p className="admin-login-form__error">{fieldErrors.username}</p> : null}
      </div>

      <div className={`admin-login-form__field${fieldErrors.password ? ' admin-login-form__field--error' : ''}`}>
        <label className="admin-login-form__label" htmlFor="login-password">
          密码
        </label>
        <UiPassword
          id="login-password"
          prefix={<LockOutlined />}
          placeholder="登录密码"
          autoComplete="current-password"
          disabled={loading}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {fieldErrors.password ? <p className="admin-login-form__error">{fieldErrors.password}</p> : null}
      </div>

      <UiButton type="submit" variant="primary" block size="lg" loading={loading}>
        登录
      </UiButton>
    </form>
  );
}
