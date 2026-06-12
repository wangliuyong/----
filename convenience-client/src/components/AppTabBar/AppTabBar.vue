<template>
  <!--
    Tab 页底部导航
    - 沉浸式 Tab（发布 / AI）不展示
    - H5 各 Tab 页各自挂载时需传 page-path，避免 fixed 实例在切换后残留
  -->
  <u-tabbar
    v-if="visible"
    :value="tabBarStore.activeIndex"
    :fixed="true"
    :placeholder="true"
    :safe-area-inset-bottom="true"
    :border="false"
    :active-color="TAB_BAR_ACTIVE_COLOR"
    :inactive-color="TAB_BAR_INACTIVE_COLOR"
    :background-color="TAB_BAR_BG"
    :z-index="1000"
    @change="onTabChange"
  >
    <u-tabbar-item
      v-for="item in TAB_BAR_ITEMS"
      :key="item.name"
      :name="item.name"
      :text="item.text"
      :icon="item.inactiveIcon"
      :active-icon="item.activeIcon"
      :inactive-icon="item.inactiveIcon"
      :mode="item.midButton ? 'midButton' : 'default'"
      :mid-button-bg-color="TAB_BAR_ACTIVE_COLOR"
      mid-button-icon-color="#ffffff"
      :mid-button-icon-size="26"
    />
  </u-tabbar>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import {
  TAB_BAR_ACTIVE_COLOR,
  TAB_BAR_BG,
  TAB_BAR_INACTIVE_COLOR,
  TAB_BAR_ITEMS,
  isTabBarHiddenPath,
  isTabSwitchPath,
  normalizeRoute,
} from '@/constants/tabbar';
import { useTabBarStore } from '@/stores/tabbar';

const props = defineProps<{
  /**
   * 当前页面路由（不含前导 /），H5 多 Tab 页各自挂载时必传
   * 微信小程序 custom-tab-bar 单例挂载时不传
   */
  pagePath?: string;
}>();

const tabBarStore = useTabBarStore();
/** 路由同步计数，确保 Tab 切换后各页面内 AppTabBar 实例重新计算显隐 */
const { routeSyncKey } = storeToRefs(tabBarStore);

/** 是否渲染 TabBar：仅 switchTab Tab 页展示，发布等子页不展示 */
const visible = computed(() => {
  // 建立对 routeSyncKey 的响应式依赖
  routeSyncKey.value;

  const pages = getCurrentPages();
  const currentRoute = normalizeRoute(pages[pages.length - 1]?.route ?? '');
  if (!currentRoute) return false;
  if (isTabBarHiddenPath(currentRoute)) return false;
  if (!isTabSwitchPath(currentRoute)) return false;
  if (props.pagePath) return currentRoute === props.pagePath;
  return true;
});

/** u-tabbar 切换回调 */
function onTabChange(name: string | number) {
  tabBarStore.switchTo(Number(name));
}
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';

:deep(.u-tabbar__content) {
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  box-shadow: 0 -8rpx 40rpx rgba(29, 78, 216, 0.1);
  border-top: 1rpx solid $cv-border !important;
}

/** 5 Tab 紧凑排版，避免 AI / 我的 被挤出可视区 */
:deep(.u-tabbar-item__text) {
  font-size: 20rpx !important;
  line-height: 1.2;
}

:deep(.u-tabbar-item) {
  padding: 0 4rpx;
}
</style>
