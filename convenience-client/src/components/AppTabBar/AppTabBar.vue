<template>
  <!-- Tab 页底部导航：AI 聊天页 tabBarHidden 时不渲染 -->
  <u-tabbar
    v-if="!tabBarStore.tabBarHidden"
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
import {
  TAB_BAR_ACTIVE_COLOR,
  TAB_BAR_BG,
  TAB_BAR_INACTIVE_COLOR,
  TAB_BAR_ITEMS,
} from '@/constants/tabbar';
import { useTabBarStore } from '@/stores/tabbar';

const tabBarStore = useTabBarStore();

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
  box-shadow: 0 -8rpx 40rpx rgba(11, 18, 32, 0.06);
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
