<template>
  <view class="category-grid">
    <view
      v-for="(item, index) in list"
      :key="item.id"
      class="category-grid__item"
      :class="[
        `category-grid__item--${index % 5}`,
        index === 0 ? 'category-grid__item--featured' : '',
      ]"
      @click="onSelect(item)"
    >
      <view class="category-grid__deco" />
      <view class="category-grid__icon-wrap">
        <u-icon :name="getCategoryRootIcon(item.id)" color="#fff" size="22" />
      </view>
      <view class="category-grid__text">
        <text class="category-grid__name">{{ item.name }}</text>
        <text class="category-grid__hint">{{ getCategoryRootHint(item.id) }}</text>
        <text v-if="item.children?.length" class="category-grid__count">
          {{ item.children.length }} 个子类
        </text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { CategoryItem } from '@/types/city-info';
import { getCategoryRootHint, getCategoryRootIcon } from '@/constants/category';

defineProps<{
  list: CategoryItem[];
}>();

const emit = defineEmits<{
  select: [item: CategoryItem];
}>();

function onSelect(item: CategoryItem) {
  emit('select', item);
}
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

/** 不对称 Bento：首项横跨两列 */
.category-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16rpx;
}

.category-grid__item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 28rpx 26rpx;
  border-radius: $cv-radius-card;
  min-height: 180rpx;
  overflow: hidden;
  box-shadow: 0 14rpx 40rpx rgba(11, 18, 32, 0.18);
  @include cv-pressable;
}

.category-grid__item--featured {
  grid-column: span 2;
  min-height: 160rpx;
  flex-direction: row;
  align-items: center;
  gap: 24rpx;
  padding: 32rpx 36rpx;
}

.category-grid__deco {
  position: absolute;
  right: -24rpx;
  top: -24rpx;
  width: 130rpx;
  height: 130rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.07);
  border: 1rpx solid rgba(255, 255, 255, 0.14);
  pointer-events: none;
}

.category-grid__item--0 {
  background: $cv-cat-1;
}

.category-grid__item--1 {
  background: $cv-cat-2;
}

.category-grid__item--2 {
  background: $cv-cat-3;
}

.category-grid__item--3 {
  background: $cv-cat-4;
}

.category-grid__item--4 {
  background: $cv-cat-5;
}

.category-grid__icon-wrap {
  width: 64rpx;
  height: 64rpx;
  border-radius: 20rpx;
  background: rgba(255, 255, 255, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1rpx solid rgba(255, 255, 255, 0.22);
  box-shadow: inset 0 1rpx 0 rgba(255, 255, 255, 0.28);
  flex-shrink: 0;
}

.category-grid__text {
  margin-top: 20rpx;

  .category-grid__item--featured & {
    margin-top: 0;
  }
}

.category-grid__name {
  display: block;
  font-size: 30rpx;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.03em;
}

.category-grid__hint {
  display: block;
  margin-top: 8rpx;
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.72);
}

.category-grid__count {
  display: block;
  margin-top: 10rpx;
  font-size: 20rpx;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.55);
  font-variant-numeric: tabular-nums;
}
</style>
