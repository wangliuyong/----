import {
  createContext,
  useCallback,
  useContext,
  useRef,
  type ReactElement,
  type ReactNode,
} from 'react';
import { useLocation, useOutlet } from 'react-router-dom';

type RouteOutletCache = Map<string, ReactElement>;

interface RouteCacheContextValue {
  /** 清空已访问路由的 Outlet 缓存（退出登录时调用） */
  clearCache: () => void;
}

const RouteCacheContext = createContext<(RouteCacheContextValue & {
  cacheRef: React.MutableRefObject<RouteOutletCache>;
}) | null>(null);

/** 路由 Outlet 缓存上下文，供 CachedOutlet 与布局层共享 */
export function RouteCacheProvider({ children }: { children: ReactNode }) {
  const cacheRef = useRef<RouteOutletCache>(new Map());

  const clearCache = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  return (
    <RouteCacheContext.Provider value={{ clearCache, cacheRef }}>
      {children}
    </RouteCacheContext.Provider>
  );
}

export function useRouteCache() {
  const ctx = useContext(RouteCacheContext);
  if (!ctx) {
    throw new Error('useRouteCache 必须在 RouteCacheProvider 内使用');
  }
  return ctx;
}

/**
 * 基于 React Router `useOutlet` 的路由级组件缓存
 *
 * React Router 未内置 KeepAlive，官方文档推荐通过 `useOutlet` 自定义 Outlet 行为。
 * 首次访问某路径时缓存其 Outlet 元素，切换 Tab 时仅隐藏不卸载，保留表单/列表状态。
 *
 * @see https://reactrouter.com/api/hooks/useOutlet
 */
export function CachedOutlet() {
  const { cacheRef } = useRouteCache();
  const location = useLocation();
  const outlet = useOutlet();
  const activeKey = location.pathname;

  // 仅首次访问写入缓存，避免返回 Tab 时被新 Outlet 实例覆盖
  if (outlet && !cacheRef.current.has(activeKey)) {
    cacheRef.current.set(activeKey, outlet);
  }

  const entries = Array.from(cacheRef.current.entries());
  // 无缓存时直接渲染当前 outlet，避免路由首屏空白
  if (entries.length === 0) {
    return outlet ?? null;
  }

  return (
    <>
      {entries.map(([key, element]) => (
        <div
          key={key}
          role="tabpanel"
          aria-hidden={key !== activeKey}
          hidden={key !== activeKey}
          style={{ display: key === activeKey ? 'block' : 'none' }}
        >
          {element}
        </div>
      ))}
    </>
  );
}
