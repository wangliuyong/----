import { useEffect, useState } from 'react';

/** 监听基座 Next / 浏览器路由 pathname 变化 */
export function usePathname(): string {
  const [pathname, setPathname] = useState(() => window.location.pathname);

  useEffect(() => {
    const sync = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', sync);
    const rawPush = history.pushState.bind(history);
    const rawReplace = history.replaceState.bind(history);
    history.pushState = (...args) => {
      rawPush(...args);
      sync();
    };
    history.replaceState = (...args) => {
      rawReplace(...args);
      sync();
    };
    return () => {
      window.removeEventListener('popstate', sync);
      history.pushState = rawPush;
      history.replaceState = rawReplace;
    };
  }, []);

  return pathname;
}
