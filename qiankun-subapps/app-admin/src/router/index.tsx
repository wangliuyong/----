import { useMemo } from 'react';
import { RouterProvider } from 'react-router-dom';
import { RouteCacheProvider } from './cache';
import { createAdminRouter } from './createRouter';

/** 管理后台路由入口：Data Router + Outlet 级缓存 */
export default function AdminRouter() {
  const router = useMemo(() => createAdminRouter(), []);

  return (
    <RouteCacheProvider>
      <RouterProvider router={router} />
    </RouteCacheProvider>
  );
}
