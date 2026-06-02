import { Navigate, createBrowserRouter, type RouteObject } from 'react-router-dom';
import LoginRoute from './guards/LoginRoute';
import RequireAuth from './guards/RequireAuth';
import AdminLayout from './layouts/AdminLayout';
import { ADMIN_PAGE_MAP } from './pageMap';
import { ADMIN_TABS, getRouterBasename } from './routes';

/**
 * Data Router 默认在导航时会 revalidate loader。
 * 后台 Tab 切换属于同级路由，关闭 revalidate 以沿用路由器内置的 loader 数据缓存。
 *
 * @see https://reactrouter.com/route/should-revalidate
 */
const keepLoaderData: NonNullable<RouteObject['shouldRevalidate']> = () => false;

/** 各业务 Tab 子路由 */
const adminTabRoutes: RouteObject[] = ADMIN_TABS.map((tab) => ({
  path: tab,
  Component: ADMIN_PAGE_MAP[tab],
  shouldRevalidate: keepLoaderData,
}));

/** 创建 Data Router 实例（Qiankun / 独立运行共用 basename） */
export function createAdminRouter() {
  return createBrowserRouter(
    [
      { path: '/login', Component: LoginRoute },
      {
        Component: RequireAuth,
        children: [
          {
            Component: AdminLayout,
            children: [
              { index: true, element: <Navigate to="/site" replace /> },
              ...adminTabRoutes,
            ],
          },
        ],
      },
      { path: '*', element: <Navigate to="/site" replace /> },
    ],
    { basename: getRouterBasename() },
  );
}
