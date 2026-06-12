import { request } from './client';
import type {
  LoginResult,
  PhoneLoginPayload,
  UpdateProfilePayload,
  UserProfile,
  WechatLoginPayload,
} from '@/types/user';
import { resolveMediaUrl } from '@/utils/media';

/** 解析用户头像等媒体字段 */
function normalizeUser(user: UserProfile): UserProfile {
  return {
    ...user,
    avatar: user.avatar ? resolveMediaUrl(user.avatar) : undefined,
  };
}

/** 微信 code 登录 */
export async function postWechatLogin(payload: WechatLoginPayload): Promise<LoginResult> {
  const result = await request<LoginResult>('/auth/wechat-login', {
    method: 'POST',
    data: payload,
    auth: false,
  });
  return { ...result, user: normalizeUser(result.user) };
}

/** 手机号密码登录 */
export async function postPhoneLogin(payload: PhoneLoginPayload): Promise<LoginResult> {
  const result = await request<LoginResult>('/auth/phone-login', {
    method: 'POST',
    data: payload,
    auth: false,
  });
  return { ...result, user: normalizeUser(result.user) };
}

/** 获取当前用户信息 */
export async function queryProfile(): Promise<UserProfile> {
  const user = await request<UserProfile>('/user/profile');
  return normalizeUser(user);
}

/** 更新用户资料 */
export async function postUpdateProfile(payload: UpdateProfilePayload): Promise<UserProfile> {
  const user = await request<UserProfile>('/user/profile', {
    method: 'PUT',
    data: payload,
  });
  return normalizeUser(user);
}

/** 退出登录 */
export function postLogout(): Promise<void> {
  return request<void>('/auth/logout', { method: 'POST' });
}
