import { message } from 'antd';
import { apiUrl, DEFAULT_API_BASE } from '../../../_shared/api';
import { clearAuth, getToken } from '../utils/auth';

/** Nest 标准错误响应体 */
interface NestErrorBody {
  statusCode?: number;
  message?: string | string[];
  error?: string;
}

/** 管理端请求配置 */
export interface RequestConfig extends RequestInit {
  /** 跳过全局错误 toast（如 profile 拉取、登录页、useAdminQuery 首屏） */
  skipErrorMessage?: boolean;
  /** 是否携带 JWT，默认 true；login 等公开接口传 false */
  auth?: boolean;
}

/** 带 HTTP 状态的业务错误，供 hooks / 页面按需捕获 */
export class ApiError extends Error {
  status: number;

  constructor(message: string, status = 0) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

let currentApiBase = DEFAULT_API_BASE;

/** 由 ApiBaseProvider 注入当前 API 根路径 */
export function setApiBase(base: string): void {
  currentApiBase = base;
}

/** 读取当前 API 根路径 */
export function getApiBase(): string {
  return currentApiBase;
}

/**
 * 解析 Nest 错误体中的 message 字段。
 * validation 错误时 message 为 string[]，需合并展示。
 */
export function parseErrorMessage(body: unknown, fallback: string): string {
  if (!body || typeof body !== 'object') return fallback;
  const { message: msg } = body as NestErrorBody;
  if (typeof msg === 'string' && msg.trim()) return msg;
  if (Array.isArray(msg) && msg.length > 0) {
    return msg.filter(Boolean).join('；');
  }
  return fallback;
}

/** 响应拦截：统一错误提示（可通过 skipErrorMessage 跳过） */
function notifyError(errorMessage: string, skipErrorMessage?: boolean): void {
  if (!skipErrorMessage) {
    message.error(errorMessage);
  }
}

/**
 * 管理端统一请求入口（fetch + 响应拦截）。
 * - 自动拼接 apiBase 与 JWT
 * - 401 清 token；4xx/5xx 解析 message 并 toast
 */
export async function request<T>(path: string, config: RequestConfig = {}): Promise<T> {
  const { skipErrorMessage, auth = true, headers, ...init } = config;

  if (auth) {
    const token = getToken();
    if (!token) {
      const err = new ApiError('未登录');
      notifyError(err.message, skipErrorMessage);
      throw err;
    }
  }

  const url = apiUrl(currentApiBase, path);
  const mergedHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...(headers || {}),
  };

  if (auth) {
    (mergedHeaders as Record<string, string>).Authorization = `Bearer ${getToken()}`;
  }

  try {
    const res = await fetch(url, {
      ...init,
      headers: mergedHeaders,
    });

    if (res.status === 401) {
      clearAuth();
      const err = new ApiError('登录已过期，请重新登录', 401);
      notifyError(err.message, skipErrorMessage);
      throw err;
    }

    if (!res.ok) {
      const text = await res.text();
      let parsed: unknown = text;
      try {
        parsed = text ? JSON.parse(text) : null;
      } catch {
        /* 非 JSON 响应保留原文 */
      }
      const errorMessage = parseErrorMessage(parsed, text || `请求失败: ${res.status}`);
      const err = new ApiError(errorMessage, res.status);
      notifyError(err.message, skipErrorMessage);
      throw err;
    }

    if (res.status === 204) return undefined as T;
    return res.json() as Promise<T>;
  } catch (e) {
    if (e instanceof ApiError) throw e;
    const err = new ApiError('网络异常，请稍后重试');
    notifyError(err.message, skipErrorMessage);
    throw err;
  }
}
