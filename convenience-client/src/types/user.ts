/** 用户类型：普通用户 / 商家 / 管理员 */
export type UserType = 'USER' | 'MERCHANT' | 'ADMIN';

/** 账号状态 */
export type UserStatus = 'ACTIVE' | 'DISABLED';

/** 用户信息（对齐 User 表） */
export interface UserProfile {
  id: number;
  openId?: string;
  phone?: string;
  nickname: string;
  avatar?: string;
  userType: UserType;
  status: UserStatus;
  realName?: string;
  createdAt: string;
}

/** 登录响应 */
export interface LoginResult {
  accessToken: string;
  user: UserProfile;
}

/** 微信登录参数 */
export interface WechatLoginPayload {
  code: string;
}

/** 手机号登录参数 */
export interface PhoneLoginPayload {
  phone: string;
  password: string;
}

/** 更新资料参数 */
export interface UpdateProfilePayload {
  nickname?: string;
  avatar?: string;
  phone?: string;
}
