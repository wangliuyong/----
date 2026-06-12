/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 是否启用 Mock 数据 */
  readonly VITE_USE_MOCK: string;
  /** Mock 请求延迟（毫秒），0 表示立即返回 */
  readonly VITE_MOCK_DELAY?: string;
  /** API 基址 */
  readonly VITE_API_BASE_URL: string;
  /** 高德 H5 JS API Key */
  readonly VITE_AMAP_KEY_WEB?: string;
  /** 高德 H5 安全密钥 */
  readonly VITE_AMAP_SECURITY_CODE?: string;
  /** 高德 Android SDK Key */
  readonly VITE_AMAP_KEY_ANDROID?: string;
  /** 高德 iOS SDK Key */
  readonly VITE_AMAP_KEY_IOS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
