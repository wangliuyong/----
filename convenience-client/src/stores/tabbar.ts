import { defineStore } from 'pinia';
import {
  isTabBarHiddenPath,
  isTabSwitchPath,
  normalizeRoute,
  PUBLISH_PAGE_PATH,
  TAB_BAR_ITEMS,
} from '@/constants/tabbar';

/**
 * 自定义 TabBar 选中态
 * 各 Tab 页 onShow 时调用 syncFromRoute，与当前路由对齐
 */
export const useTabBarStore = defineStore('tabbar', {
  state: () => ({
    activeIndex: 0,
    /** 沉浸式 Tab 页（AI）：隐藏底部 TabBar */
    tabBarHidden: false,
    /** 每次 syncFromRoute 递增，驱动各页面 AppTabBar 重新计算显隐 */
    routeSyncKey: 0,
  }),
  actions: {
    /** 根据当前页面路由同步高亮项与 TabBar 显隐 */
    syncFromRoute() {
      const pages = getCurrentPages();
      const route = normalizeRoute(pages[pages.length - 1]?.route ?? '');
      this.tabBarHidden = isTabBarHiddenPath(route);
      const index = TAB_BAR_ITEMS.findIndex((item) => item.pagePath === route);
      // 发布为独立子页，不更新 Tab 高亮
      if (index >= 0 && route !== PUBLISH_PAGE_PATH) {
        this.activeIndex = index;
      }
      this.routeSyncKey += 1;
    },
    /** 切换 Tab 或打开发布子页 */
    switchTo(index: number) {
      const target = TAB_BAR_ITEMS[index];
      if (!target) return;

      // 发布：独立子页，APP 端不走 switchTab 以避免原生 TabBar 残留
      if (target.pagePath === PUBLISH_PAGE_PATH || target.switchTab === false) {
        // 立即刷新各 Tab 页内 AppTabBar 显隐，避免 fixed 实例在 navigateTo 过渡期间露出
        this.routeSyncKey += 1;
        uni.navigateTo({
          url: `/${target.pagePath}`,
          fail: () => {
            uni.showToast({ title: '无法打开发布页', icon: 'none' });
          },
        });
        return;
      }

      if (index === this.activeIndex) return;
      this.activeIndex = index;
      uni.switchTab({ url: `/${target.pagePath}` });
    },
    /** 当前栈顶是否为 switchTab Tab 页（用于 AppTabBar 显隐） */
    isTopTabSwitchPage(): boolean {
      const pages = getCurrentPages();
      const route = normalizeRoute(pages[pages.length - 1]?.route ?? '');
      return isTabSwitchPath(route) && !isTabBarHiddenPath(route);
    },
  },
});
