import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { isLoggedIn } from '../utils/auth';

/**
 * 路由守卫：未登录跳转 /login，并记录来源路径供登录后回跳
 */
export default function RequireAuth() {
  const location = useLocation();

  if (!isLoggedIn()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
