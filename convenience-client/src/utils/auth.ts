/** Token 本地存储键名 */
const TOKEN_KEY = 'accessToken';
const USER_KEY = 'userProfile';

/** 读取 accessToken */
export function getAccessToken(): string {
  return uni.getStorageSync(TOKEN_KEY) || '';
}

/** 写入 accessToken */
export function setAccessToken(token: string): void {
  uni.setStorageSync(TOKEN_KEY, token);
}

/** 清除登录态 */
export function clearAuthStorage(): void {
  uni.removeStorageSync(TOKEN_KEY);
  uni.removeStorageSync(USER_KEY);
}

/** 读取缓存的用户信息 */
export function getStoredUser<T>(): T | null {
  const raw = uni.getStorageSync(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw as string) as T;
  } catch {
    return null;
  }
}

/** 缓存用户信息 */
export function setStoredUser<T>(user: T): void {
  uni.setStorageSync(USER_KEY, JSON.stringify(user));
}

/** 是否已登录 */
export function isLoggedIn(): boolean {
  return Boolean(getAccessToken());
}

/** 401 时跳转登录页 */
export function redirectToLogin(): void {
  const pages = getCurrentPages();
  const current = pages[pages.length - 1];
  const route = current ? `/${(current as UniApp.PageInstance).route}` : '';
  if (route.includes('/pages/auth/login')) return;

  uni.navigateTo({
    url: '/pages/auth/login',
  });
}
