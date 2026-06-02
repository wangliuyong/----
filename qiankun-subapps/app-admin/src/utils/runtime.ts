/** 是否在 Qiankun 基座外独立运行（直接访问 :4007 或 preview） */
export function isAdminStandalone(): boolean {
  return typeof window !== 'undefined' && !window.__POWERED_BY_QIANKUN__;
}

/** 独立开发/预览时的默认 API 地址 */
export function getStandaloneApiBase(): string {
  return import.meta.env.VITE_API_BASE || 'http://localhost:3001/api';
}

/** 独立运行时的默认挂载 props */
export function getStandaloneHostProps() {
  return {
    apiBase: getStandaloneApiBase(),
  };
}
