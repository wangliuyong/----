/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 是否启用 Mock 数据 */
  readonly VITE_USE_MOCK: string;
  /** Mock 请求延迟（毫秒），0 表示立即返回 */
  readonly VITE_MOCK_DELAY?: string;
  /** API 基址 */
  readonly VITE_API_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
