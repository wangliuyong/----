import type { AdminTab } from './types';

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

/** 根据基座 pathname 解析当前 Tab（/admin → site） */
export function resolveAdminTab(pathname: string): AdminTab {
  const match = pathname.match(/^\/admin(?:\/([^/?#]+))?/);
  const segment = match?.[1];
  if (segment && TAB_SET.has(segment)) {
    return segment as AdminTab;
  }
  return 'site';
}

/** Tab 对应的基座 URL */
export function adminTabPath(tab: AdminTab): string {
  return `/admin/${tab}`;
}

/** 侧栏切换 Tab：更新地址栏，usePathname 会同步 React 状态 */
export function navigateAdminTab(tab: AdminTab) {
  const path = adminTabPath(tab);
  if (window.location.pathname !== path) {
    history.pushState(null, '', path);
  }
}

/** 进入 /admin 根路径时归一化到默认 Tab */
export function normalizeAdminPathname(pathname: string) {
  if (pathname === '/admin' || pathname === '/admin/') {
    history.replaceState(null, '', adminTabPath('site'));
  }
}
