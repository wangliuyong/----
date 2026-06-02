import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import AdminShell from '../../components/AdminShell';
import { clearAuth, getUsername } from '../../utils/auth';
import { adminTabPath, resolveAdminTab } from '../routes';

/**
 * 后台主布局：侧栏导航 + 顶栏 + 子路由 Outlet
 * 子路由组件在 routeTable.tsx 中注册
 */
export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const tab = resolveAdminTab(location.pathname);

  return (
    <AdminShell
      username={getUsername() || ''}
      tab={tab}
      onTabChange={(nextTab) => navigate(adminTabPath(nextTab))}
      onLogout={() => {
        clearAuth();
        navigate('/login', { replace: true });
      }}
    >
      <Outlet />
    </AdminShell>
  );
}
