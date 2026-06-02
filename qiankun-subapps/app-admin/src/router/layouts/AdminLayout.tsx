import { useLocation, useNavigate } from 'react-router-dom';
import AdminShell from '../../components/AdminShell';
import { clearAuth, getUsername } from '../../utils/auth';
import { CachedOutlet, useRouteCache } from '../cache';
import { adminTabPath, resolveAdminTab } from '../routes';

/**
 * 后台主布局：侧栏 + CachedOutlet（useOutlet 路由缓存）
 */
export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCache } = useRouteCache();
  const tab = resolveAdminTab(location.pathname);

  return (
    <AdminShell
      username={getUsername() || ''}
      tab={tab}
      onTabChange={(nextTab) => navigate(adminTabPath(nextTab))}
      onLogout={() => {
        clearAuth();
        clearCache();
        navigate('/login', { replace: true });
      }}
    >
      <CachedOutlet />
    </AdminShell>
  );
}
