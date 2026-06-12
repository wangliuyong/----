import type { ApiResponse } from '@/types/api-response';
import { getApiBaseUrl } from '@/utils/api-base-url';
import { getAccessToken, redirectToLogin } from '@/utils/auth';

/** HTTP 请求配置 */
export interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: Record<string, unknown> | string;
  /** 是否携带 JWT，默认 true */
  auth?: boolean;
  /** 是否跳过全局错误提示 */
  skipErrorMessage?: boolean;
  /** 401 时不跳转登录页（用于收藏 ID 等可选登录接口） */
  skipAuthRedirect?: boolean;
}

const BASE_URL = getApiBaseUrl();

/** 拼接完整 URL */
function buildUrl(path: string): string {
  if (path.startsWith('http')) return path;
  return `${BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}

/**
 * GET 请求将 data 序列化为 query string
 * 手写拼接，兼容微信小程序（部分基础库 URLSearchParams 不可用）
 */
function appendQuery(url: string, data?: Record<string, unknown> | string): string {
  if (!data || typeof data === 'string') return url;
  const parts: string[] = [];
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
    }
  });
  if (!parts.length) return url;
  const qs = parts.join('&');
  return `${url}${url.includes('?') ? '&' : '?'}${qs}`;
}

/** 统一 Toast 错误提示 */
function showError(message: string) {
  uni.showToast({ title: message, icon: 'none', duration: 2500 });
}

/**
 * 封装 uni.request
 * - 自动注入 Authorization
 * - 统一解析 ApiResponse
 */
export function request<T>(path: string, config: RequestConfig = {}): Promise<T> {
  const {
    method = 'GET',
    data,
    auth = true,
    skipErrorMessage = false,
    skipAuthRedirect = false,
  } = config;

  const header: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (auth) {
    const token = getAccessToken();
    if (token) header.Authorization = `Bearer ${token}`;
  }

  const isGet = method === 'GET';
  const url = isGet && data && typeof data === 'object'
    ? appendQuery(buildUrl(path), data as Record<string, unknown>)
    : buildUrl(path);
  const requestData = isGet ? undefined : data;

  return new Promise((resolve, reject) => {
    uni.request({
      url,
      method,
      data: requestData,
      header,
      success: (res) => {
        const status = res.statusCode as number;
        if (status === 401) {
          if (!skipAuthRedirect) redirectToLogin();
          reject(new Error('未登录'));
          return;
        }

        const body = res.data as ApiResponse<T>;
        if (body && typeof body === 'object' && 'code' in body) {
          if (body.code === 0) {
            resolve(body.data);
            return;
          }
          if (!skipErrorMessage) showError(body.message || '请求失败');
          reject(new Error(body.message || '请求失败'));
          return;
        }

        resolve(res.data as T);
      },
      fail: (err) => {
        if (!skipErrorMessage) showError('网络异常，请稍后重试');
        reject(err);
      },
    });
  });
}

/** 封装 uni.uploadFile（图片上传） */
export function uploadFile(filePath: string): Promise<{ url: string }> {
  const token = getAccessToken();

  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: buildUrl('/upload/image'),
      filePath,
      name: 'file',
      header: token ? { Authorization: `Bearer ${token}` } : {},
      success: (res) => {
        try {
          const body = JSON.parse(res.data) as ApiResponse<{ url: string }>;
          if (body.code === 0) {
            resolve(body.data);
            return;
          }
          showError(body.message || '上传失败');
          reject(new Error(body.message));
        } catch {
          reject(new Error('上传响应解析失败'));
        }
      },
      fail: (err) => {
        showError('上传失败');
        reject(err);
      },
    });
  });
}
