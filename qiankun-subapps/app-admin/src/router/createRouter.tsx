import { Navigate, createBrowserRouter, type RouteObject } from 'react-router-dom';
import ForbiddenPage from '../pages/forbidden';
import type { AdminMenuNode } from '../types/rbac';
import LoginRoute from './guards/LoginRoute';
import RequireAuth from './guards/RequireAuth';
import AdminLayout from './layouts/AdminLayout';
import { flattenLeafMenus, getDefaultMenuPath } from './menuUtils';
import { getPageComponent } from './pageRegistry';
import { getRouterBasename } from './routes';

const keepLoaderData: NonNullable<RouteObject['shouldRevalidate']> = () => false;

/** 根据用户可访问菜单动态生成路由 */
export function createAdminRouter(menus: AdminMenuNode[]) {
  const leafMenus = flattenLeafMenus(menus);
  const defaultPath = getDefaultMenuPath(menus);

  const adminTabRoutes: RouteObject[] = leafMenus
    .filter((m) => m.path && m.component && getPageComponent(m.component))
    .map((m) => ({
      path: m.path!,
      Component: getPageComponent(m.component)!,
      shouldRevalidate: keepLoaderData,
    }));

  return createBrowserRouter(
    [
      { path: '/login', Component: LoginRoute },
      {
        Component: RequireAuth,
        children: [
          {
            Component: AdminLayout,
            children: [
              { index: true, element: <Navigate to={`/${defaultPath}`} replace /> },
              ...adminTabRoutes,
              { path: '403', Component: ForbiddenPage },
            ],
          },
        ],
      },
      { path: '*', element: <Navigate to={`/${defaultPath}`} replace /> },
    ],
    { basename: getRouterBasename() },
  );
}
