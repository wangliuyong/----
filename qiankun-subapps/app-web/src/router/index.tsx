import { useMemo } from 'react';
import { RouterProvider } from 'react-router-dom';
import { createWebRouter } from './createRouter';

/** 前台路由入口：Data Router */
export default function WebRouter() {
  const router = useMemo(() => createWebRouter(), []);

  return <RouterProvider router={router} />;
}
