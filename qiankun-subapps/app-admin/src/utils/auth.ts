const TOKEN_KEY = 'personal-site-admin-token';
const USER_KEY = 'personal-site-admin-user';

/** 读取本地 JWT */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/** 保存登录态 */
export function saveAuth(token: string, username: string) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, username);
}

/** 清除登录态 */
export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/** 当前登录用户名 */
export function getUsername(): string | null {
  return localStorage.getItem(USER_KEY);
}

/** 是否已登录 */
export function isLoggedIn(): boolean {
  return Boolean(getToken());
}
