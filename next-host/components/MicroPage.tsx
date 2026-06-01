'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { initQiankun, syncQiankunTheme, type HostCallbacks } from '@/app/utils/qiankun';

interface MicroPageProps {
  /** 联系页：留言成功时基座 Toast */
  hostCallbacks?: HostCallbacks;
}

/**
 * 微前端统一容器：挂载 #micro-container，由 Qiankun 按路由加载子应用
 */
export function MicroPage({ hostCallbacks }: MicroPageProps) {
  const { theme, resolvedTheme } = useTheme();
  const [ready, setReady] = useState(false);
  const currentTheme = theme === 'system' ? resolvedTheme : theme;

  useEffect(() => {
    window.__HOST_CALLBACKS__ = hostCallbacks;
    return () => {
      if (window.__HOST_CALLBACKS__ === hostCallbacks) {
        delete window.__HOST_CALLBACKS__;
      }
    };
  }, [hostCallbacks]);

  useEffect(() => {
    if (!ready) {
      initQiankun(currentTheme || 'light');
      setReady(true);
      return;
    }
    syncQiankunTheme(currentTheme || 'light');
  }, [currentTheme, ready]);

  return (
    <div id="micro-container" className="w-full min-h-[40vh]">
      {!ready && (
        <div className="text-center py-20 text-gray-500">页面加载中...</div>
      )}
    </div>
  );
}
