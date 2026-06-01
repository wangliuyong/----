'use client';

import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';
import { API_BASE, loadWebComponent, wcScriptUrl } from '@/app/utils/loadWc';

type WcTag =
  | 'wc-home'
  | 'wc-about'
  | 'wc-blog'
  | 'wc-projects'
  | 'wc-contact'
  | 'wc-links';

interface WcPageProps {
  scriptName: string;
  tag: WcTag;
  attrs?: Record<string, string>;
  onMessageSuccess?: (msg: string) => void;
}

/**
 * 通用 Web Component 页面容器：懒加载脚本 + 透传 theme/api-base
 */
export function WcPage({
  scriptName,
  tag,
  attrs = {},
  onMessageSuccess,
}: WcPageProps) {
  const { theme } = useTheme();
  const [loaded, setLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    loadWebComponent(wcScriptUrl(scriptName))
      .then(() => setLoaded(true))
      .catch(console.error);
  }, [scriptName]);

  useEffect(() => {
    if (!loaded || !containerRef.current) return;

    const el = document.createElement(tag);
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(el);
    elementRef.current = el;
  }, [loaded, tag]);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const resolvedTheme = theme === 'dark' ? 'dark' : 'light';
    el.setAttribute('theme', resolvedTheme);
    el.setAttribute('api-base', API_BASE);
    Object.entries(attrs).forEach(([key, value]) => {
      el.setAttribute(key, value);
    });
  }, [loaded, theme, attrs]);

  useEffect(() => {
    const el = elementRef.current;
    if (!el || !onMessageSuccess) return;

    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ msg: string }>).detail;
      onMessageSuccess(detail?.msg || '操作成功');
    };

    el.addEventListener('message-success', handler);
    return () => el.removeEventListener('message-success', handler);
  }, [loaded, onMessageSuccess]);

  if (!loaded) {
    return (
      <div className="text-center py-20 text-gray-500">加载中...</div>
    );
  }

  return <div ref={containerRef} />;
}
