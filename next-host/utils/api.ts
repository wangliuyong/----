/** 浏览器端 API 根路径（可通过环境变量覆盖） */
export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:3001/api';

/**
 * 服务端 SSR 请求 API 根路径
 * Docker 内网用 API_BASE_INTERNAL（如 http://api:3001/api），浏览器仍走 NEXT_PUBLIC_API_BASE
 */
export function getServerApiBase(): string {
  return (
    process.env.API_BASE_INTERNAL ??
    process.env.NEXT_PUBLIC_API_BASE ??
    'http://localhost:3001/api'
  );
}
