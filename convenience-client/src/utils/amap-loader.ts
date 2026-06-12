/**
 * 动态加载高德 JS API 2.0（仅 H5 地图选点使用）
 * Key 来自 .env.local：VITE_AMAP_KEY_WEB + VITE_AMAP_SECURITY_CODE
 */

declare global {
  interface Window {
    AMap?: unknown;
    _AMapSecurityConfig?: { securityJsCode: string };
  }
}

let loadPromise: Promise<unknown> | null = null;

/** 加载高德 AMap 命名空间，重复调用复用同一 Promise */
export function loadAmap(): Promise<unknown> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('AMap 仅支持 H5 浏览器环境'));
  }

  if (window.AMap) {
    return Promise.resolve(window.AMap);
  }

  if (loadPromise) {
    return loadPromise;
  }

  const key = import.meta.env.VITE_AMAP_KEY_WEB || '';
  const securityJsCode = import.meta.env.VITE_AMAP_SECURITY_CODE || '';

  if (!key) {
    return Promise.reject(new Error('未配置 VITE_AMAP_KEY_WEB（见 .env.local）'));
  }

  if (securityJsCode) {
    window._AMapSecurityConfig = { securityJsCode };
  }

  loadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${encodeURIComponent(key)}`;
    script.onload = () => {
      if (window.AMap) {
        resolve(window.AMap);
        return;
      }
      loadPromise = null;
      reject(new Error('高德 JS API 加载失败'));
    };
    script.onerror = () => {
      loadPromise = null;
      reject(new Error('高德 JS API 脚本加载失败'));
    };
    document.head.appendChild(script);
  });

  return loadPromise;
}
