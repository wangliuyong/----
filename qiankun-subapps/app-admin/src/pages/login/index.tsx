import LoginForm from './components/LoginForm';
import LoginPageLayout from './components/LoginPageLayout';
import { useLoginPage } from './hooks/useLoginPage';
import type { LoginPageProps } from './types';

/** 路由 login — 管理后台登录 */
export default function LoginPage({ onSuccess }: LoginPageProps) {
  const { loading, error, onFinish } = useLoginPage(onSuccess);

  return (
    <LoginPageLayout>
      <LoginForm loading={loading} error={error} onFinish={onFinish} />
    </LoginPageLayout>
  );
}
