'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useTheme } from 'next-themes';
import { initQiankun, syncQiankunTheme } from '@/utils/qiankun';

interface QiankunProviderProps {
  children: ReactNode;
}

/**
 * 全站唯一的微前端挂载点（放在 layout 中，路由切换时不销毁 #micro-container）
 * 加载提示放在容器外，避免 React 与 Qiankun 同时操作同一 DOM 子节点导致 removeChild 报错
 */
export function QiankunProvider({ children }: QiankunProviderProps) {
  const { theme, resolvedTheme } = useTheme();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const currentTheme = theme === 'system' ? resolvedTheme : theme;

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
        console.error('[QiankunProvider] init failed', e);
        if (!cancelled) {
          setError('微前端加载失败，请确认子应用已启动（app-web :4001、app-admin :4007）');
        }
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [currentTheme, ready]);

  return (
    <>
      {children}

      <div className="relative w-full min-h-[40vh]">
        {!ready && !error && (
          <div className="absolute inset-0 z-10 flex items-center justify-center site-loading pointer-events-none">
            页面加载中...
          </div>
        )}
        {error && <div className="site-error">{error}</div>}
        {/* 仅 Qiankun / 子应用可写入，React 永不向此节点内插入子元素 */}
        <div id="micro-container" className="w-full min-h-[40vh]" />
      </div>
    </>
  );
}
