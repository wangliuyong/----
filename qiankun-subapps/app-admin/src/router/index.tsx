import { useMemo } from 'react';
import { RouterProvider } from 'react-router-dom';
import PageLoading from '../components/_common/PageLoading';
import { useAuth } from '../context/AuthContext';
import { isLoggedIn } from '../utils/auth';
import { RouteCacheProvider } from './cache';
import { createAdminRouter } from './createRouter';

/** 管理后台路由入口：profile 就绪后按权限动态注册路由 */
export default function AdminRouter() {
  const { profile, loading } = useAuth();

  const router = useMemo(
    () => createAdminRouter(profile?.menus ?? []),
    [profile?.menus],
  );

  if (isLoggedIn() && loading) {
    return <PageLoading />;
  }

  return (
    <RouteCacheProvider>
      <RouterProvider router={router} key={profile?.id ?? 'guest'} />
    </RouteCacheProvider>
  );
}
