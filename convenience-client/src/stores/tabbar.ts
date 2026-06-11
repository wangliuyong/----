import { defineStore } from 'pinia';
import { AI_PAGE_PATH, TAB_BAR_ITEMS } from '@/constants/tabbar';

/**
 * 自定义 TabBar 选中态
 * 各 Tab 页 onShow 时调用 syncFromRoute，与当前路由对齐
 */
export const useTabBarStore = defineStore('tabbar', {
  state: () => ({
    activeIndex: 0,
    /** AI 聊天页沉浸式模式：隐藏底部 TabBar */
    tabBarHidden: false,
  }),
  actions: {
    /** 根据当前页面路由同步高亮项与 TabBar 显隐 */
    syncFromRoute() {
      const pages = getCurrentPages();
      const route = pages[pages.length - 1]?.route ?? '';
      this.tabBarHidden = route === AI_PAGE_PATH;
      const index = TAB_BAR_ITEMS.findIndex((item) => item.pagePath === route);
      if (index >= 0) {
        this.activeIndex = index;
      }
    },
    /** 切换 Tab 并跳转 */
    switchTo(index: number) {
      const target = TAB_BAR_ITEMS[index];
      if (!target || index === this.activeIndex) return;
      this.activeIndex = index;
      uni.switchTab({ url: `/${target.pagePath}` });
    },
  },
});
