/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** API 基址 */
  readonly VITE_API_BASE_URL: string;
  /** 微信小程序本地开发 API 基址（无法请求 localhost） */
  readonly VITE_API_BASE_URL_MP_WEIXIN?: string;
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
