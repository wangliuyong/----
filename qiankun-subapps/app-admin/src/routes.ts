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

/** React Router basename：独立 /，基座 /admin */
export function getRouterBasename(): string {
  return isAdminStandalone() ? '/' : '/admin';
}

/**
 * 从 React Router 相对 pathname 解析 Tab（侧栏高亮用）
 * BrowserRouter basename 已剥离 /admin 前缀，此处只需处理 /site 等形式
 */
export function resolveAdminTab(pathname: string): AdminTab {
  const segment = pathname.replace(/^\/+/, '').split('/')[0];
  if (segment && TAB_SET.has(segment)) {
    return segment as AdminTab;
  }
  return 'site';
}

/** Tab 对应的 React Router 相对路径（不含 basename） */
export function adminTabPath(tab: AdminTab): string {
  return `/${tab}`;
}
