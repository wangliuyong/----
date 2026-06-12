/**
 * 获取 API 请求基址
 *
 * - H5 本地开发：使用 .env.development 中的 localhost（可走 Vite proxy）
 * - 微信小程序本地开发：无法请求 localhost，使用 VITE_API_BASE_URL_MP_WEIXIN
 * - 生产 / 打包构建：由各 mode 对应 .env 文件中的 VITE_API_BASE_URL 注入
 */
export function getApiBaseUrl(): string {
  // #ifdef MP-WEIXIN
  if (import.meta.env.DEV) {
    return import.meta.env.VITE_API_BASE_URL_MP_WEIXIN || 'http://47.116.30.137/api';
  }
  // #endif

  return import.meta.env.VITE_API_BASE_URL || '/api';
}
