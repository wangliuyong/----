import { Navigate, createBrowserRouter, type RouteObject } from 'react-router-dom';
import { getRouterBasename } from './routes';
import { WEB_ROUTE_CONFIG } from './webRoutes';

/** 将 WEB_ROUTE_CONFIG 转为 Data Router 路由表 */
const webRoutes: RouteObject[] = WEB_ROUTE_CONFIG.map((route) =>
  'index' in route && route.index
    ? { index: true, Component: route.Page }
    : { path: route.path, Component: route.Page },
);

/** 创建 Data Router 实例（Qiankun 基座与独立 :4001 共用 basename /） */
export function createWebRouter() {
  return createBrowserRouter(
    [
      ...webRoutes,
      { path: '*', element: <Navigate to="/" replace /> },
    ],
    { basename: getRouterBasename() },
  );
}
