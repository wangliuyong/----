/** 独立开发/预览时的默认 API 地址（可通过 .env.development 的 VITE_API_BASE 覆盖） */
export function getStandaloneApiBase(): string {
  return import.meta.env.VITE_API_BASE || 'http://localhost:3001/api';
}

/** 独立运行时的默认挂载 props */
export function getStandaloneHostProps() {
  return {
    apiBase: getStandaloneApiBase(),
  };
}
