/** 默认 API 根路径，可由基座 props.apiBase 覆盖 */
export const DEFAULT_API_BASE = 'http://localhost:3001/api';

/** 拼接 REST 路径 */
export function apiUrl(base: string, path: string): string {
  const normalized = base.replace(/\/$/, '');
  return `${normalized}${path.startsWith('/') ? path : `/${path}`}`;
}

/** 通用 GET 请求 */
export async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`请求失败: ${res.status}`);
  }
  return res.json() as Promise<T>;
}
