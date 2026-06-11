import { defineStore } from 'pinia';
import { AI_PAGE_PATH } from '@/constants/tabbar';

/**
 * AI 会话状态
 * AI 为 Tab 页，历史页通过 pendingSessionId 传递会话后 switchTab
 */
export const useAiStore = defineStore('ai', {
  state: () => ({
    /** 待打开的会话 ID，AI Tab 页 onShow 时消费 */
    pendingSessionId: null as number | null,
  }),
  actions: {
    /** 从历史页打开指定会话：写入 pending 后 switchTab 到 AI Tab */
    openSessionTab(sessionId: number) {
      this.pendingSessionId = sessionId;
      uni.switchTab({ url: `/${AI_PAGE_PATH}` });
    },

    /** @deprecated 使用 openSessionTab */
    openSessionPage(sessionId: number) {
      this.openSessionTab(sessionId);
    },

    /** 读取并清空 pendingSessionId */
    consumePendingSessionId(): number | null {
      const id = this.pendingSessionId;
      this.pendingSessionId = null;
      return id;
    },
  },
});
