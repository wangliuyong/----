/**
 * H5 子路径部署时（如 /convenience/），为 /static 资源补全应用 base
 * 小程序 / App 本地 static 目录无需前缀
 */
function resolveStaticAssetUrl(url: string): string {
  // #ifdef H5
  const base = import.meta.env.BASE_URL || '/';
  if (base && base !== '/' && base !== './') {
    const normalized = base.endsWith('/') ? base.slice(0, -1) : base;
    return `${normalized}${url}`;
  }
  // #endif
  return url;
}

/**
 * 将后端返回的媒体 URL 转为当前端可访问的完整地址
 * - 已是 http(s)/data: 则原样返回
 * - /static/* 在 H5 子路径部署时补全 BASE_URL
 * - /api/upload/image/:id 等相对路径补全 API 域名
 */
export function resolveMediaUrl(url?: string | null): string {
  if (!url) return '';
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('data:') ||
    url.startsWith('wxfile://') ||
    url.startsWith('file://')
  ) {
    return url;
  }

  if (url.startsWith('/static')) {
    return resolveStaticAssetUrl(url);
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
