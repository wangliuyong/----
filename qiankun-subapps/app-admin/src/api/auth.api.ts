import type { AdminProfile } from '../types/rbac';
import { request, type RequestConfig } from './client';

/** 登录（无需 JWT） */
export async function login(
  username: string,
  password: string,
  config?: Pick<RequestConfig, 'skipErrorMessage'>,
) {
  return request<{ accessToken: string; username: string }>('/auth/login', {
    method: 'POST',
    auth: false,
    body: JSON.stringify({ username, password }),
    skipErrorMessage: config?.skipErrorMessage,
  });
}

/** 获取当前登录用户 profile（菜单 + 权限码） */
export function getProfile(config?: Pick<RequestConfig, 'skipErrorMessage'>) {
  return request<AdminProfile>('/admin/auth/profile', {
    skipErrorMessage: config?.skipErrorMessage,
  });
}
