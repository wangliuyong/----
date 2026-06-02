import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import AdminShell from '../components/AdminShell';
import { adminTabPath, resolveAdminTab } from '../routes';
import { clearAuth, getUsername } from '../utils/auth';

/**
 * 已登录后台布局：侧栏 + 顶栏 + 子路由 Outlet
 * 每个子路由对应 pages/ 下的独立页面组件
 */
export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const tab = resolveAdminTab(location.pathname);
  const username = getUsername() || '';

  const handleLogout = () => {
    clearAuth();
    navigate('/login', { replace: true });
  };

  const handleTabChange = (nextTab: typeof tab) => {
    navigate(adminTabPath(nextTab));
  };

  return (
    <AdminShell
      username={username}
      tab={tab}
      onTabChange={handleTabChange}
      onLogout={handleLogout}
    >
      <Outlet />
    </AdminShell>
  );
}
