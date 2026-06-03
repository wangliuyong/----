import { request } from './client';

/** 分页列表通用响应 */
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

/** 操作审计日志 */
export interface AuditLog {
  id: number;
  userId: number | null;
  username: string | null;
  action: string;
  module: string | null;
  targetId: string | null;
  detail: string | null;
  ip: string | null;
  createdAt: string;
}

/** 应用运行日志 */
export interface AppLog {
  id: number;
  level: string;
  message: string;
  context: string | null;
  stack: string | null;
  createdAt: string;
}

/** 审计日志查询参数 */
export interface AuditLogQuery {
  page?: number;
  pageSize?: number;
  action?: string;
  username?: string;
  module?: string;
}

/** 应用日志查询参数 */
export interface AppLogQuery {
  page?: number;
  pageSize?: number;
  level?: string;
  keyword?: string;
}

/** 构建带 query string 的路径 */
function withQuery(path: string, query: AuditLogQuery | AppLogQuery) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query as Record<string, string | number | undefined>)) {
    if (value !== undefined && value !== '') {
      params.set(key, String(value));
    }
  }
  const qs = params.toString();
  return qs ? `${path}?${qs}` : path;
}

/** 分页查询操作审计日志 */
export function listAuditLogs(query: AuditLogQuery = {}) {
  return request<PaginatedResult<AuditLog>>(withQuery('/admin/logs/audit', query));
}

/** 分页查询应用运行日志 */
export function listAppLogs(query: AppLogQuery = {}) {
  return request<PaginatedResult<AppLog>>(withQuery('/admin/logs/app', query));
}
