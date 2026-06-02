import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import AdminShell from '../components/AdminShell';
import {
  AboutPage,
  ArticlesPage,
  ContactPage,
  LoginPage,
  MessagesPage,
  NavPage,
  ProjectsPage,
  SitePage,
} from '../pages';
import { clearAuth, getUsername, isLoggedIn } from '../utils/auth';
import { adminTabPath, getRouterBasename, resolveAdminTab } from './routes';

/** 路由守卫：未登录跳转 /login */
function RequireAuth() {
  const location = useLocation();

  if (!isLoggedIn()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}

/** 登录页：已登录则回跳 */
function LoginRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from || '/site';

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

/** 已登录布局：侧栏 + Outlet */
function AdminLayout() {
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

/** 管理后台路由表 */
export default function AdminRouter() {
  return (
    <BrowserRouter basename={getRouterBasename()}>
      <Routes>
        <Route path="/login" element={<LoginRoute />} />

        <Route element={<RequireAuth />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="/site" replace />} />
            <Route path="site" element={<SitePage />} />
            <Route path="nav" element={<NavPage />} />
            <Route path="articles" element={<ArticlesPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="messages" element={<MessagesPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/site" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
