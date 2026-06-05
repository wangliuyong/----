'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { API_BASE } from '@/utils/api';

/**
 * 前台路由切换时上报页面浏览。
 * 使用 keepalive fetch，避免离开页面时请求被中断。
 */
export function PageViewTracker() {
  const pathname = usePathname();
  const lastPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || pathname.startsWith('/admin')) return;
    if (lastPathRef.current === pathname) return;
    lastPathRef.current = pathname;

    const body = JSON.stringify({
      path: pathname,
      referrer: typeof document !== 'undefined' ? document.referrer || undefined : undefined,
    });

    void fetch(`${API_BASE}/analytics/pageview`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    }).catch(() => {
      /* 统计失败不影响前台体验 */
    });
  }, [pathname]);

  return null;
}
