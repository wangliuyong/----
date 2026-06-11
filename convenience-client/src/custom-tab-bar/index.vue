<template>
  <AppTabBar />
</template>

<script setup lang="ts">
/**
 * 微信小程序 custom-tab-bar 入口
 * pages.json tabBar.custom = true 时由原生容器挂载
 * AI 聊天页通过 tabBarStore.tabBarHidden 隐藏底部 Tab
 */
import { onShow } from '@dcloudio/uni-app';
import AppTabBar from '@/components/AppTabBar/AppTabBar.vue';
import { useTabBarStore } from '@/stores/tabbar';

const tabBarStore = useTabBarStore();

/** 切 Tab 时同步显隐状态（与 Tab 页 useTabBarPage 配合） */
onShow(() => {
  tabBarStore.syncFromRoute();
});
</script>
