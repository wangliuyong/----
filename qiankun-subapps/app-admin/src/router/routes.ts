import { ADMIN_TABS, type AdminTab } from './adminTabs';
import { isAdminStandalone } from '../utils/runtime';

export { ADMIN_TABS, type AdminTab };

const TAB_SET = new Set<string>(ADMIN_TABS);

/** React Router basename：独立 /，基座 /admin */
export function getRouterBasename(): string {
  return isAdminStandalone() ? '/' : '/admin';
}

/** 从 pathname 解析当前 Tab（侧栏高亮） */
export function resolveAdminTab(pathname: string): AdminTab {
  const segment = pathname.replace(/^\/+/, '').split('/')[0];
  if (segment && TAB_SET.has(segment)) {
    return segment as AdminTab;
  }
  return 'site';
}

/** Tab 对应的 React Router 相对路径 */
export function adminTabPath(tab: AdminTab): string {
  return `/${tab}`;
}
