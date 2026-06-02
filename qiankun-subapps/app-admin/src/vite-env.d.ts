/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 独立运行时后端 API 根路径 */
  readonly VITE_API_BASE?: string;
  /** 独立运行时「返回前台」链接（可选） */
  readonly VITE_PUBLIC_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare global {
  interface Window {
    __POWERED_BY_QIANKUN__?: boolean;
  }
}

export {};