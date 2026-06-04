'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { WebMicroContainer } from '@/components/StableMicroAppContainer';
import { isQiankunSitePath } from '@/router';
import { initQiankun, syncQiankunTheme } from '@/utils/qiankun';

interface QiankunProviderProps {
  children: ReactNode;
}

/**
 * 前台 Qiankun 初始化与 app-web 挂载区
 * 加载态与 #micro-container 分离，避免 setReady 触发 re-render 清空子应用 DOM
 */
export function QiankunProvider({ children }: QiankunProviderProps) {
  const pathname = usePathname();
  const isQiankunRoute = isQiankunSitePath(pathname);
  const { theme, resolvedTheme } = useTheme();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const currentTheme = theme === 'system' ? resolvedTheme : theme;

  /** 仅首次挂载时注册并启动 Qiankun */
  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        await initQiankun(currentTheme || 'light');
        if (!cancelled) setReady(true);
      } catch (e) {
        console.error('[QiankunProvider] init failed', e);
        if (!cancelled) {
          setError(
            '微前端加载失败，请确认子应用已启动（app-web :4001、app-admin :4007）',
          );
        }
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 仅初始化一次，主题变更走下方 effect
  }, []);

  /** 主题切换时同步 Qiankun 全局状态，不触碰挂载点 DOM */
  useEffect(() => {
    if (!ready) return;
    syncQiankunTheme(currentTheme || 'light');
  }, [currentTheme, ready]);

  return (
    <>
      {children}

      {/* SSR 路由（首页/博客）由 Next 直接输出；其余路由挂载 Qiankun 子应用 */}
      <div
        className={`relative w-full ${isQiankunRoute ? 'min-h-[40vh]' : 'hidden'}`}
        aria-hidden={!isQiankunRoute}
      >
        {isQiankunRoute && !ready && !error && (
          <div className="absolute inset-0 z-10 flex items-center justify-center site-loading pointer-events-none">
            页面加载中...
          </div>
        )}
        {error && isQiankunRoute && <div className="site-error">{error}</div>}
        <WebMicroContainer
          className={isQiankunRoute ? 'w-full min-h-[40vh]' : 'hidden'}
        />
      </div>
    </>
  );
}
