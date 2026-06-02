import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LoginPage } from '../../pages';
import { getDefaultMenuPath } from '../menuUtils';
import { formatDocumentTitle, LOGIN_PAGE_TITLE } from '../pageTitle';
import { isLoggedIn } from '../../utils/auth';

interface LoginLocationState {
  from?: string;
}

/** 访客路由：已登录用户访问 /login 时重定向到目标页或默认首页 */
export default function LoginRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, reloadProfile } = useAuth();
  const from = (location.state as LoginLocationState | null)?.from;

  useEffect(() => {
    document.title = formatDocumentTitle(LOGIN_PAGE_TITLE);
  }, []);

  if (isLoggedIn() && profile) {
    const target = from || `/${getDefaultMenuPath(profile.menus)}`;
    return <Navigate to={target} replace />;
  }

  return (
    <LoginPage
      onSuccess={async () => {
        const nextProfile = await reloadProfile();
        const target = from || `/${getDefaultMenuPath(nextProfile?.menus ?? [])}`;
        navigate(target, { replace: true });
      }}
    />
  );
}
