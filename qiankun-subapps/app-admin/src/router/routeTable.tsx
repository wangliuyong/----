import type { ComponentType } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import {
  AboutPage,
  ArticlesPage,
  ContactPage,
  MessagesPage,
  NavPage,
  ProjectsPage,
  SitePage,
} from '../pages';
import type { AdminTab } from '../types';
import { LoginRoute, RequireAuth } from './guards';
import { AdminLayout } from './layouts';
import { ADMIN_TABS } from './routes';

/** Tab 与页面组件映射，新增后台页时在此注册 */
const ADMIN_PAGE_MAP: Record<AdminTab, ComponentType> = {
  site: SitePage,
  nav: NavPage,
  articles: ArticlesPage,
  projects: ProjectsPage,
  about: AboutPage,
  contact: ContactPage,
  messages: MessagesPage,
};

/**
 * 管理后台路由表
 * - /login：访客登录
 * - RequireAuth → AdminLayout → 各业务页
 */
export default function AdminRouteTable() {
  return (
    <Routes>
      <Route path="/login" element={<LoginRoute />} />

      <Route element={<RequireAuth />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="/site" replace />} />
          {ADMIN_TABS.map((tab) => {
            const Page = ADMIN_PAGE_MAP[tab];
            return <Route key={tab} path={tab} element={<Page />} />;
          })}
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/site" replace />} />
    </Routes>
  );
}
