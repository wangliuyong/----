import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { LoginPage } from '../pages';
import { isLoggedIn } from '../utils/auth';

/**
 * 登录路由：已登录则重定向到后台首页或登录前页面
 */
export default function LoginRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    (location.state as { from?: string } | null)?.from || '/site';

  if (isLoggedIn()) {
    return <Navigate to={from} replace />;
  }

  return (
    <LoginPage
      onSuccess={() => {
        navigate(from, { replace: true });
      }}
    />
  );
}
