import type { AdminTab } from '../types';
import { isAdminStandalone } from '../utils/runtime';

/** 侧栏菜单 Tab 顺序 */
export const ADMIN_TABS: AdminTab[] = [
  'site',
  'nav',
  'articles',
  'projects',
  'about',
  'contact',
  'messages',
];

/** 侧栏显示文案 */
export const ADMIN_TAB_LABELS: Record<AdminTab, string> = {
  site: '站点设置',
  nav: '导航管理',
  articles: '博客管理',
  projects: '项目管理',
  about: '关于我',
  contact: '联系我',
  messages: '留言管理',
};

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
