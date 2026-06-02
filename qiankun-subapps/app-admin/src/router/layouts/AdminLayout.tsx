import { useLocation, useNavigate } from 'react-router-dom';
import AdminShell from '../../components/AdminShell';
import { useAuth } from '../../context/AuthContext';
import PageLoading from '../../components/_common/PageLoading';
import { clearAuth, getUsername } from '../../utils/auth';
import { CachedOutlet, useRouteCache } from '../cache';
import { resolveMenuPath } from '../menuUtils';

/** 后台主布局：动态侧栏 + CachedOutlet */
export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCache } = useRouteCache();
  const { profile, loading } = useAuth();

  if (loading || !profile) {
    return <PageLoading />;
  }

  const currentPath = resolveMenuPath(location.pathname, profile.menus);

  return (
    <AdminShell
      username={getUsername() || profile.username}
      menus={profile.menus}
      currentPath={currentPath}
      onNavigate={(path) => navigate(`/${path}`)}
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
