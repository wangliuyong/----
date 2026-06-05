import type { AdminMenuNode } from '../types/rbac';
import { getMenuTitleByPath, resolveMenuPath } from './menuUtils';

/** 浏览器 Tab 与顶栏共用的产品名 */
export const APP_BRAND = '网站后台管理';

/** 无法匹配菜单时的默认页面标题 */
export const DEFAULT_PAGE_TITLE = '内容管理系统';

/** 登录页标题 */
export const LOGIN_PAGE_TITLE = '登录';

/**
 * 根据当前 pathname 与 RBAC 菜单树解析页面标题。
 * 403 等特殊路由在此集中处理，避免布局层重复判断。
 */
export function resolvePageTitle(pathname: string, menus: AdminMenuNode[]): string {
  const normalized = pathname.replace(/\/+$/, '');
  if (normalized === '403' || normalized.endsWith('/403')) {
    return '无权限访问';
  }
  const menuPath = resolveMenuPath(pathname, menus);
  return getMenuTitleByPath(menuPath, menus);
}

/**
 * 生成 document.title：子页为「页面名 - 产品名」，首页/默认页仅显示产品名。
 */
export function formatDocumentTitle(pageTitle: string): string {
  if (pageTitle === APP_BRAND || pageTitle === DEFAULT_PAGE_TITLE) {
    return APP_BRAND;
  }
  return `${pageTitle} - ${APP_BRAND}`;
}
