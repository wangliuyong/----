/**
 * 将后端返回的媒体 URL 转为当前端可访问的完整地址
 * - 已是 http(s)/data:/static 则原样返回
 * - /api/upload/image/:id 等相对路径补全 API 域名
 */
export function resolveMediaUrl(url?: string | null): string {
  if (!url) return '';
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('data:') ||
    url.startsWith('/static') ||
    url.startsWith('wxfile://') ||
    url.startsWith('file://')
  ) {
    return url;
  }

  const apiBase = import.meta.env.VITE_API_BASE_URL || '/api';
  const origin = apiBase.replace(/\/api\/?$/, '');

  if (url.startsWith('/api/')) {
    return origin ? `${origin}${url}` : url;
  }

  if (url.startsWith('/uploads/')) {
    return origin ? `${origin}${url}` : url;
  }

  return url;
}

/** 批量解析图片 URL 列表 */
export function resolveMediaUrls(urls?: string[]): string[] {
  return (urls || []).map((u) => resolveMediaUrl(u));
}
