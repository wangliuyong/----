import type { AdminTab } from './types';
import { isAdminStandalone } from './utils/runtime';

/** 所有管理 Tab（顺序与侧栏一致） */
export const ADMIN_TABS: AdminTab[] = [
  'site',
  'nav',
  'articles',
  'projects',
  'about',
  'contact',
  'messages',
];

/** 依赖站点配置接口的 Tab */
export const SITE_DATA_TABS: AdminTab[] = ['site', 'nav', 'about', 'contact'];

const TAB_SET = new Set<string>(ADMIN_TABS);

/** 独立模式：/site；基座模式：/admin/site */
function parseTabSegment(pathname: string): string | undefined {
  if (isAdminStandalone()) {
    const segment = pathname.replace(/^\/+/, '').split('/')[0];
    return segment || undefined;
  }

  const match = pathname.match(/^\/admin(?:\/([^/?#]+))?/);
  return match?.[1];
}

/** 根据 pathname 解析当前 Tab */
export function resolveAdminTab(pathname: string): AdminTab {
  const segment = parseTabSegment(pathname);
  if (segment && TAB_SET.has(segment)) {
    return segment as AdminTab;
  }
  return 'site';
}

/** Tab 对应的 URL 路径 */
export function adminTabPath(tab: AdminTab): string {
  const suffix = `/${tab}`;
  return isAdminStandalone() ? suffix : `/admin${suffix}`;
}

/** 侧栏切换 Tab：更新地址栏，usePathname 会同步 React 状态 */
export function navigateAdminTab(tab: AdminTab) {
  const path = adminTabPath(tab);
  if (window.location.pathname !== path) {
    history.pushState(null, '', path);
  }
}

/** 进入根路径时归一化到默认 Tab（/ → /site 或 /admin → /admin/site） */
export function normalizeAdminPathname(pathname: string) {
  if (isAdminStandalone()) {
    if (pathname === '/' || pathname === '') {
      history.replaceState(null, '', adminTabPath('site'));
    }
    return;
  }

  if (pathname === '/admin' || pathname === '/admin/') {
    history.replaceState(null, '', adminTabPath('site'));
  }
}
