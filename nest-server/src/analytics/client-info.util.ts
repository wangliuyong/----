import type { Request } from 'express';
import geoip from 'geoip-lite';

/** app-web 子应用需统计的路径（与 qiankun-subapps/_shared/analytics.ts 保持一致） */
export const APP_WEB_ANALYTICS_PATHS = [
  '/about',
  '/projects',
  '/contact',
  '/links',
];

/** Prisma 查询条件：仅 app-web 页面 */
export const APP_WEB_PAGE_VIEW_WHERE = {
  path: { in: APP_WEB_ANALYTICS_PATHS },
};

/** 是否 app-web 页面路径 */
export function isAppWebAnalyticsPath(path: string): boolean {
  const normalized = path.replace(/\/+$/, '') || '/';
  return (APP_WEB_ANALYTICS_PATHS as readonly string[]).includes(normalized);
}

/** 从代理头或 socket 解析客户端 IP */
export function resolveClientIp(req: Request): string | null {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',')[0]?.trim() ?? null;
  }
  if (Array.isArray(forwarded) && forwarded[0]) {
    return forwarded[0].split(',')[0]?.trim() ?? null;
  }
  const ip = req.ip ?? req.socket?.remoteAddress;
  if (!ip) return null;
  return ip.replace(/^::ffff:/, '');
}

/** 解析 User-Agent 为浏览器 / 系统 / 设备类型 */
export function parseUserAgent(raw?: string): {
  browser: string | null;
  os: string | null;
  device: string | null;
} {
  if (!raw?.trim()) {
    return { browser: null, os: null, device: null };
  }

  const ua = raw.slice(0, 512);
  let device: string = 'desktop';
  if (/Mobile|Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
    device = /iPad|Tablet|PlayBook|Silk/i.test(ua) ? 'tablet' : 'mobile';
  }

  let browser: string = 'Unknown';
  if (/Edg\//i.test(ua)) browser = 'Edge';
  else if (/OPR\//i.test(ua) || /Opera/i.test(ua)) browser = 'Opera';
  else if (/Firefox\//i.test(ua)) browser = 'Firefox';
  else if (/Chrome\//i.test(ua)) browser = 'Chrome';
  else if (/Safari\//i.test(ua)) browser = 'Safari';
  else if (/MSIE|Trident/i.test(ua)) browser = 'IE';

  let os: string = 'Unknown';
  if (/Windows NT/i.test(ua)) os = 'Windows';
  else if (/Mac OS X/i.test(ua)) os = 'macOS';
  else if (/Android/i.test(ua)) os = 'Android';
  else if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS';
  else if (/Linux/i.test(ua)) os = 'Linux';

  return { browser, os, device };
}

/**
 * 根据 IP 解析地理区域（离线库，内网/本地 IP 返回 null）
 * geoip-lite 为可选依赖，未安装时仅记录 IP
 */
export function resolveRegionFromIp(ip: string | null): string | null {
  if (!ip) return null;
  const normalized = ip.trim();
  if (
    normalized === '127.0.0.1' ||
    normalized === '::1' ||
    /^10\./.test(normalized) ||
    /^192\.168\./.test(normalized) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(normalized)
  ) {
    return null;
  }

  try {
    const hit = geoip.lookup(normalized);
    if (!hit) return null;
    return [hit.country, hit.region, hit.city].filter(Boolean).join(' ') || null;
  } catch {
    return null;
  }
}
