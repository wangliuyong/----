/** 管理后台路径前缀（与 app-admin basename 对齐） */
export const ADMIN_BASE = '/admin';

/** 是否处于管理后台路由 */
export function isAdminPath(pathname: string): boolean {
  return pathname === ADMIN_BASE || pathname.startsWith(`${ADMIN_BASE}/`);
}
