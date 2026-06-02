import { useEffect, useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { PageTitleProvider } from '../../context/PageTitleContext';
import { useAuth } from '../../context/AuthContext';
import {
  DEFAULT_PAGE_TITLE,
  formatDocumentTitle,
  resolvePageTitle,
} from '../pageTitle';

/**
 * 路由守卫：监听 pathname 变化，解析页面标题并写入 document.title。
 * 同时通过 Context 下发，供 AdminShell 顶栏展示，避免在布局层重复计算。
 */
export default function PageTitleGuard() {
  const location = useLocation();
  const { profile } = useAuth();

  const pageTitle = useMemo(() => {
    if (!profile?.menus?.length) {
      return DEFAULT_PAGE_TITLE;
    }
    return resolvePageTitle(location.pathname, profile.menus);
  }, [location.pathname, profile?.menus]);

  useEffect(() => {
    document.title = formatDocumentTitle(pageTitle);
  }, [pageTitle]);

  return (
    <PageTitleProvider title={pageTitle}>
      <Outlet />
    </PageTitleProvider>
  );
}
