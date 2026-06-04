import { isAdminPath } from './adminRoutes';
import { FALLBACK_NAV, SITE_ROUTE_CONFIG } from './siteRoutes';

export { ADMIN_BASE, isAdminPath } from './adminRoutes';
export {
  FALLBACK_NAV,
  SITE_ROUTE_CONFIG,
  type SiteRouteDef,
  type SiteRouteKey,
} from './siteRoutes';

/** 是否匹配前台站点路径（含 SSR 与 Qiankun 子应用路由） */
export function isPublicSitePath(pathname: string): boolean {
  if (pathname === '/') return true;

  return SITE_ROUTE_CONFIG.some((route) => {
    if (route.path === '/') return false;
    if (route.matchPrefix) {
      return pathname === route.path || pathname.startsWith(`${route.path}/`);
    }
    return pathname === route.path;
  });
}

/** 是否由 Next.js 服务端渲染（首页 / 博客） */
export function isSsrSitePath(pathname: string): boolean {
  return SITE_ROUTE_CONFIG.some((route) => {
    if (!route.ssr) return false;
    if (route.path === '/') return pathname === '/';
    if (route.matchPrefix) {
      return pathname === route.path || pathname.startsWith(`${route.path}/`);
    }
    return pathname === route.path;
  });
}

/** 是否由 Qiankun app-web 渲染（排除 SSR 路由） */
export function isQiankunSitePath(pathname: string): boolean {
  return isPublicSitePath(pathname) && !isSsrSitePath(pathname);
}

/** 顶栏导航高亮 */
export function isNavLinkActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** 博客详情页路径 */
export function blogDetailPath(id: string | number): string {
  return `/blog/${id}`;
}

/** 联系页需注册基座留言回调 */
export function needsContactCallbacks(pathname: string): boolean {
  return SITE_ROUTE_CONFIG.some(
    (route) => route.hostExtras === 'contact' && pathname === route.path,
  );
}
