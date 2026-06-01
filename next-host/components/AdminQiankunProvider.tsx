'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { initQiankun } from '@/app/utils/qiankun';

interface AdminQiankunProviderProps {
  children: ReactNode;
}

/**
 * 管理后台专用 Qiankun 挂载点
 * - 全屏容器，不嵌套在前台 MainNav / Footer 内
 * - 固定浅色主题，与 Ant Design 后台风格一致
 */
export function AdminQiankunProvider({ children }: AdminQiankunProviderProps) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        await initQiankun('light');
        if (!cancelled) setReady(true);
      } catch (e) {
        console.error('[AdminQiankunProvider] init failed', e);
        if (!cancelled) {
          setError('管理后台加载失败，请确认 app-admin 子应用已启动（4007）');
        }
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full">
      {children}

      {!ready && !error && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#f0f2f5] text-gray-500 text-sm">
          管理后台加载中...
        </div>
      )}
      {error && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#f0f2f5] text-red-500 text-sm px-4 text-center">
          {error}
        </div>
      )}

      {/* Qiankun 子应用挂载点：占满视口高度 */}
      <div id="micro-container" className="min-h-screen w-full" />
    </div>
  );
}
