<template>
  <view class="page-category cv-page">
    <view class="page-category__hero">
      <view class="page-category__hero-glow" />
      <view class="page-category__hero-main">
        <text class="page-category__title">全部分类</text>
        <text class="page-category__desc">按类别浏览同城便民信息</text>
      </view>
      <view class="page-category__stats">
        <view class="page-category__stat">
          <text class="page-category__stat-num">{{ categories.length }}</text>
          <text class="page-category__stat-label">大类</text>
        </view>
        <view class="page-category__stat-divider" />
        <view class="page-category__stat">
          <text class="page-category__stat-num">{{ totalSubCount }}</text>
          <text class="page-category__stat-label">子类</text>
        </view>
      </view>
    </view>

    <view class="page-category__body">
      <!-- 一级分类：横向滑动选择 -->
      <view class="page-category__roots cv-card">
        <CategoryRootStrip
          :list="categories"
          :active-id="activeRootId"
          layout="scroll"
          @select="onSelectRoot"
        />
      </view>

      <!-- 当前大类概览 -->
      <view
        v-if="activeRoot"
        class="page-category__banner"
        :class="`page-category__banner--tone-${activeRootIndex % 5}`"
      >
        <view class="page-category__banner-icon">
          <u-icon :name="getCategoryRootIcon(activeRoot.id)" color="#fff" size="22" />
        </view>
        <view class="page-category__banner-text">
          <text class="page-category__banner-name">{{ activeRoot.name }}</text>
          <text class="page-category__banner-hint">{{ getCategoryRootHint(activeRoot.id) }}</text>
        </view>
        <view class="page-category__banner-count">
          <text class="page-category__banner-count-num">{{ activeChildren.length }}</text>
          <text class="page-category__banner-count-label">个子类</text>
        </view>
      </view>

      <!-- 二级分类：双列网格 -->
      <view class="page-category__subs">
        <CategorySubGrid
          v-if="activeChildren.length"
          :list="activeChildren"
          @select="goList"
        />
        <u-empty v-else mode="data" text="暂无子分类" />
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
import CategoryRootStrip from '@/components/CategoryRootStrip/CategoryRootStrip.vue';
import CategorySubGrid from '@/components/CategorySubGrid/CategorySubGrid.vue';
import { getCategoryRootHint, getCategoryRootIcon } from '@/constants/category';
import { useTabBarPage } from '@/composables/useTabBarPage';
import type { CategoryItem } from '@/types/city-info';

useTabBarPage();

const categories = ref<CategoryItem[]>([]);
const activeRootId = ref(0);

/** 全部子分类数量 */
const totalSubCount = computed(() =>
  categories.value.reduce((sum, root) => sum + (root.children?.length || 0), 0),
);

const activeRoot = computed(() => categories.value.find((c) => c.id === activeRootId.value));

const activeRootIndex = computed(() =>
  categories.value.findIndex((c) => c.id === activeRootId.value),
);

const activeChildren = computed(() => activeRoot.value?.children || []);

function onSelectRoot(item: CategoryItem) {
  activeRootId.value = item.id;
}

function goList(sub: CategoryItem) {
  uni.navigateTo({
    url: `/pages/info/list?categoryId=${sub.id}&title=${sub.name}&rootId=${activeRootId.value || ''}`,
  });
}

onMounted(async () => {
  categories.value = await queryCategoryTree();
  if (categories.value.length) {
    activeRootId.value = categories.value[0].id;
  }
});
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.page-category__hero {
  position: relative;
  overflow: hidden;
  @include cv-hero-bg;
  padding: 28rpx $cv-space-page 52rpx;
  padding-top: calc(28rpx + env(safe-area-inset-top));
}

.page-category__hero-glow {
  @include cv-hero-orb(280rpx, -40rpx, -50rpx);
}

.page-category__hero-main {
  position: relative;
  z-index: 1;
}

.page-category__title {
  display: block;
  font-size: 48rpx;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.05em;
}

.page-category__desc {
  display: block;
  margin-top: 10rpx;
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.78);
  line-height: 1.45;
}

.page-category__stats {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 24rpx;
  margin-top: 28rpx;
  padding: 20rpx 28rpx;
  border-radius: $cv-radius-sm;
  background: rgba(255, 255, 255, 0.1);
  border: 1rpx solid rgba(255, 255, 255, 0.16);
  width: fit-content;
}

.page-category__stat {
  display: flex;
  align-items: baseline;
  gap: 8rpx;
}

.page-category__stat-num {
  font-size: 36rpx;
  font-weight: 700;
  color: #fff;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.04em;
}

.page-category__stat-label {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.72);
}

.page-category__stat-divider {
  width: 1rpx;
  height: 32rpx;
  background: rgba(255, 255, 255, 0.2);
}

.page-category__body {
  @include cv-body-sheet;
  margin-top: -36rpx;
}

.page-category__roots {
  padding: 20rpx 16rpx 16rpx;
  margin-bottom: 20rpx;
}

.page-category__banner {
  display: flex;
  align-items: center;
  gap: 18rpx;
  padding: 24rpx 24rpx;
  border-radius: $cv-radius-card;
  margin-bottom: 20rpx;
  box-shadow: 0 14rpx 40rpx rgba(11, 18, 32, 0.16);
  overflow: hidden;

  &--tone-0 {
    background: $cv-cat-1;
  }

  &--tone-1 {
    background: $cv-cat-2;
  }

  &--tone-2 {
    background: $cv-cat-3;
  }

  &--tone-3 {
    background: $cv-cat-4;
  }

  &--tone-4 {
    background: $cv-cat-5;
  }
}

.page-category__banner-icon {
  width: 72rpx;
  height: 72rpx;
  border-radius: 22rpx;
  background: rgba(255, 255, 255, 0.14);
  border: 1rpx solid rgba(255, 255, 255, 0.22);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.page-category__banner-text {
  flex: 1;
  min-width: 0;
}

.page-category__banner-name {
  display: block;
  font-size: 32rpx;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.03em;
}

.page-category__banner-hint {
  display: block;
  margin-top: 6rpx;
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.72);
}

.page-category__banner-count {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12rpx 18rpx;
  border-radius: $cv-radius-sm;
  background: rgba(255, 255, 255, 0.12);
  border: 1rpx solid rgba(255, 255, 255, 0.18);
  flex-shrink: 0;
}

.page-category__banner-count-num {
  font-size: 30rpx;
  font-weight: 700;
  color: #fff;
  font-variant-numeric: tabular-nums;
  line-height: 1;
}

.page-category__banner-count-label {
  margin-top: 4rpx;
  font-size: 18rpx;
  color: rgba(255, 255, 255, 0.72);
}

.page-category__subs {
  padding-bottom: 16rpx;
}
</style>
