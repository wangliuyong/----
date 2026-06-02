import { isAdminPath } from './adminRoutes';
import { FALLBACK_NAV, SITE_ROUTE_CONFIG } from './siteRoutes';

export { ADMIN_BASE, isAdminPath } from './adminRoutes';
export {
  FALLBACK_NAV,
  SITE_ROUTE_CONFIG,
  type SiteRouteDef,
  type SiteRouteKey,
} from './siteRoutes';

/** 是否匹配前台 app-web 激活路径 */
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
