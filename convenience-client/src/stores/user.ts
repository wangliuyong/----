import { defineStore } from 'pinia';
import type { UserProfile } from '@/types/user';
import {
  clearAuthStorage,
  getStoredUser,
  setAccessToken,
  setStoredUser,
} from '@/utils/auth';

interface UserState {
  profile: UserProfile | null;
  token: string;
}

/** 用户登录态 Store */
export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    profile: null,
    token: '',
  }),

  getters: {
    isLoggedIn: (state) => Boolean(state.token),
    nickname: (state) => state.profile?.nickname || '未登录',
  },

  actions: {
    /** 从本地存储恢复登录态 */
    restoreFromStorage() {
      this.token = uni.getStorageSync('accessToken') || '';
      this.profile = getStoredUser<UserProfile>();
    },

    /** 登录成功后写入状态 */
    setLogin(token: string, profile: UserProfile) {
      this.token = token;
      this.profile = profile;
      setAccessToken(token);
      setStoredUser(profile);
    },

    /** 更新资料 */
    updateProfile(profile: UserProfile) {
      this.profile = profile;
      setStoredUser(profile);
    },

    /** 退出登录 */
    logout() {
      this.token = '';
      this.profile = null;
      clearAuthStorage();
    },
  },
});
