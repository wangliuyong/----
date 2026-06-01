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
  const [error, setError] = useState('');
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
    let cancelled = false;

    const run = async () => {
      try {
        if (!ready) {
          await initQiankun(currentTheme || 'light');
          if (!cancelled) setReady(true);
        } else {
          syncQiankunTheme(currentTheme || 'light');
        }
      } catch (e) {
        console.error('[MicroPage] qiankun init failed', e);
        if (!cancelled) {
          setError('微前端加载失败，请确认子应用已启动（4001–4006）');
        }
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [currentTheme, ready]);

  if (error) {
    return (
      <div className="text-center py-20 text-red-500 text-sm">{error}</div>
    );
  }

  return (
    <div id="micro-container" className="w-full min-h-[40vh]">
      {!ready && (
        <div className="text-center py-20 text-gray-500">页面加载中...</div>
      )}
    </div>
  );
}
