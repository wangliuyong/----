import { request } from './client';
import { mockDelay, mockUser } from '@/mock/data';
import { useMock } from '@/utils/platform';
import type {
  LoginResult,
  PhoneLoginPayload,
  UpdateProfilePayload,
  UserProfile,
  WechatLoginPayload,
} from '@/types/user';

/** Mock 登录结果 */
function buildMockLogin(): LoginResult {
  return {
    accessToken: 'mock_jwt_token_' + Date.now(),
    user: { ...mockUser },
  };
}

/** 微信 code 登录 */
export async function postWechatLogin(payload: WechatLoginPayload): Promise<LoginResult> {
  if (useMock()) {
    await mockDelay();
    return buildMockLogin();
  }
  return request<LoginResult>('/auth/wechat-login', {
    method: 'POST',
    data: payload,
    auth: false,
  });
}

/** 手机号密码登录 */
export async function postPhoneLogin(payload: PhoneLoginPayload): Promise<LoginResult> {
  if (useMock()) {
    await mockDelay();
    if (payload.phone === '13800138000' && payload.password === '123456') {
      return buildMockLogin();
    }
    throw new Error('手机号或密码错误（Mock：13800138000 / 123456）');
  }
  return request<LoginResult>('/auth/phone-login', {
    method: 'POST',
    data: payload,
    auth: false,
  });
}

/** 获取当前用户信息 */
export async function queryProfile(): Promise<UserProfile> {
  if (useMock()) {
    await mockDelay(200);
    return { ...mockUser };
  }
  return request<UserProfile>('/user/profile');
}

/** 更新用户资料 */
export async function postUpdateProfile(payload: UpdateProfilePayload): Promise<UserProfile> {
  if (useMock()) {
    await mockDelay();
    Object.assign(mockUser, payload);
    return { ...mockUser };
  }
  return request<UserProfile>('/user/profile', {
    method: 'PUT',
    data: payload,
  });
}

/** 退出登录 */
export async function postLogout(): Promise<void> {
  if (useMock()) {
    await mockDelay(100);
    return;
  }
  return request<void>('/auth/logout', { method: 'POST' });
}
