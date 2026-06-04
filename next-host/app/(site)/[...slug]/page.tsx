'use client';

import { ContactCallbacks } from '@/components/ContactCallbacks';
import { needsContactCallbacks } from '@/router';
import { usePathname } from 'next/navigation';

/**
 * 前台 catch-all 占位页（不含 / 与 SSR 路由）
 * 页面内容由 Qiankun app-web 渲染；联系页额外注册基座留言回调
 */
export default function SiteCatchAllPage() {
  const pathname = usePathname();

  if (needsContactCallbacks(pathname)) {
    return <ContactCallbacks />;
  }

  return null;
}
