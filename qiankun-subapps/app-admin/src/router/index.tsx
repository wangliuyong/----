import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import LoginRoute from '../layouts/LoginRoute';
import RequireAuth from '../layouts/RequireAuth';
import {
  AboutPage,
  ArticlesPage,
  ContactPage,
  MessagesPage,
  NavPage,
  ProjectsPage,
  SitePage,
} from '../pages';
import { getRouterBasename } from '../routes';

/**
 * 管理后台路由表
 * 每个 path 对应 pages/ 下一个独立页面组件
 */
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
