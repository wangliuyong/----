<template>
  <view class="page-category cv-page">
    <view class="page-category__hero">
      <view class="page-category__hero-glow" />
      <text class="page-category__title">全部分类</text>
      <text class="page-category__desc">按类别浏览同城便民信息</text>
    </view>

    <view class="page-category__body">
      <view class="page-category__tabs cv-card">
        <u-tabs
          :list="tabList"
          :current="currentTab"
          line-color="#1d4ed8"
          line-width="32"
          line-height="4"
          active-style="color: #1d4ed8; font-weight: 700; font-size: 30rpx;"
          inactive-style="color: #8b9bb8; font-size: 28rpx;"
          @change="onTabChange"
        />
      </view>

      <view class="page-category__content">
        <view
          v-for="(sub, idx) in currentChildren"
          :key="sub.id"
          class="page-category__item cv-card"
          @click="goList(sub)"
        >
          <view class="page-category__item-num">{{ String(idx + 1).padStart(2, '0') }}</view>
          <view class="page-category__item-left">
            <text class="page-category__name">{{ sub.name }}</text>
            <text class="page-category__parent">{{ currentRootName }}</text>
          </view>
          <view class="page-category__go">
            <u-icon name="arrow-right" color="#1d4ed8" size="14" />
          </view>
        </view>
        <u-empty v-if="!currentChildren.length" mode="data" text="暂无子分类" />
      </view>
    </view>

    <!-- #ifndef MP-WEIXIN -->
    <AppTabBar page-path="pages/category/index" />
    <!-- #endif -->
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { queryCategoryTree } from '@/api/category.api';
import AppTabBar from '@/components/AppTabBar/AppTabBar.vue';
import { useTabBarPage } from '@/composables/useTabBarPage';
import type { CategoryItem } from '@/types/city-info';

useTabBarPage();

const categories = ref<CategoryItem[]>([]);
const currentTab = ref(0);

const tabList = computed(() => categories.value.map((c) => ({ name: c.name })));
const currentChildren = computed(() => categories.value[currentTab.value]?.children || []);
const currentRootName = computed(() => categories.value[currentTab.value]?.name || '');

function onTabChange(e: { index: number }) {
  currentTab.value = e.index;
}

function goList(sub: CategoryItem) {
  const root = categories.value[currentTab.value];
  uni.navigateTo({
    url: `/pages/info/list?categoryId=${sub.id}&title=${sub.name}&rootId=${root?.id || ''}`,
  });
}

onMounted(async () => {
  categories.value = await queryCategoryTree();
});
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.page-category__hero {
  position: relative;
  overflow: hidden;
  @include cv-hero-bg;
  padding: 32rpx $cv-space-page 56rpx;
  padding-top: calc(32rpx + env(safe-area-inset-top));
}

.page-category__hero-glow {
  @include cv-hero-orb(280rpx, -40rpx, -50rpx);
}

.page-category__title {
  position: relative;
  z-index: 1;
  display: block;
  font-size: 48rpx;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.05em;
}

.page-category__desc {
  position: relative;
  z-index: 1;
  display: block;
  margin-top: 12rpx;
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
}

.page-category__body {
  @include cv-body-sheet;
  margin-top: -36rpx;
}

.page-category__tabs {
  padding: 12rpx 12rpx 0;
  overflow: hidden;
}

.page-category__content {
  padding-top: 28rpx;
}

.page-category__item {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 32rpx 28rpx;
  margin-bottom: 18rpx;
  @include cv-pressable;
}

.page-category__item-num {
  font-size: 22rpx;
  font-weight: 600;
  color: $cv-text-muted;
  font-variant-numeric: tabular-nums;
  flex-shrink: 0;
  width: 48rpx;
}

.page-category__item-left {
  flex: 1;
  min-width: 0;
}

.page-category__name {
  display: block;
  font-size: 32rpx;
  font-weight: 700;
  color: $cv-text;
  letter-spacing: -0.03em;
}

.page-category__parent {
  display: block;
  margin-top: 6rpx;
  font-size: 22rpx;
  color: $cv-text-muted;
}

.page-category__go {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  background: $cv-primary-soft;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
</style>
