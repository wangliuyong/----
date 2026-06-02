import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { LoginPage } from '../../pages';
import { isLoggedIn } from '../../utils/auth';

/** 登录页 location.state 结构 */
interface LoginLocationState {
  from?: string;
}

/**
 * 访客路由：已登录用户访问 /login 时重定向到目标页或默认首页
 */
export default function LoginRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    (location.state as LoginLocationState | null)?.from || '/site';

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
