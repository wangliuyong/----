<template>
  <!--
    一级分类选择条
    - scroll：横向滑动，适合分类 Tab 页
    - wrap：自动换行，适合发布页（仅子分类横向滚动）
  -->
  <scroll-view
    v-if="layout === 'scroll'"
    scroll-x
    enable-flex
    class="category-root-strip category-root-strip--scroll"
    :show-scrollbar="false"
  >
    <view class="category-root-strip__track">
      <view
        v-for="(item, index) in list"
        :key="item.id"
        class="category-root-strip__item"
        :class="[
          `category-root-strip__item--tone-${index % 5}`,
          { 'category-root-strip__item--active': item.id === activeId },
        ]"
        @click="emit('select', item)"
      >
        <view class="category-root-strip__icon">
          <u-icon
            :name="getCategoryRootIcon(item.id)"
            :color="item.id === activeId ? '#fff' : '#1d4ed8'"
            size="18"
          />
        </view>
        <text class="category-root-strip__name">{{ item.name }}</text>
        <text v-if="showHint" class="category-root-strip__hint">{{ getCategoryRootHint(item.id) }}</text>
      </view>
    </view>
  </scroll-view>

  <view v-else class="category-root-strip category-root-strip--wrap">
    <view
      v-for="(item, index) in list"
      :key="item.id"
      class="category-root-strip__pill"
      :class="[
        `category-root-strip__pill--tone-${index % 5}`,
        { 'category-root-strip__pill--active': item.id === activeId },
      ]"
      @click="emit('select', item)"
    >
      <view class="category-root-strip__pill-icon">
        <u-icon
          :name="getCategoryRootIcon(item.id)"
          :color="item.id === activeId ? '#fff' : '#1d4ed8'"
          size="14"
        />
      </view>
      <text class="category-root-strip__pill-name">{{ item.name }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { CategoryItem } from '@/types/city-info';
import { getCategoryRootHint, getCategoryRootIcon } from '@/constants/category';

withDefaults(
  defineProps<{
    list: CategoryItem[];
    activeId: number;
    /** scroll 横向滑动 | wrap 换行静态展示 */
    layout?: 'scroll' | 'wrap';
    showHint?: boolean;
  }>(),
  {
    layout: 'scroll',
    showHint: true,
  },
);

const emit = defineEmits<{
  select: [item: CategoryItem];
}>();
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.category-root-strip--scroll {
  width: 100%;
  height: 168rpx;
  white-space: nowrap;
}

.category-root-strip__track {
  display: inline-flex;
  align-items: stretch;
  gap: 14rpx;
  height: 168rpx;
  padding: 4rpx 4rpx 8rpx;
  box-sizing: border-box;
}

.category-root-strip__item {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-end;
  width: 168rpx;
  padding: 18rpx 16rpx;
  border-radius: $cv-radius-sm;
  background: $cv-surface-muted;
  border: 1rpx solid $cv-border;
  flex-shrink: 0;
  overflow: hidden;
  position: relative;
  @include cv-pressable;

  &--tone-0 {
    background: linear-gradient(155deg, rgba(11, 18, 32, 0.04) 0%, rgba(29, 78, 216, 0.08) 100%);
  }

  &--tone-1 {
    background: linear-gradient(155deg, rgba(30, 41, 59, 0.05) 0%, rgba(71, 85, 105, 0.1) 100%);
  }

  &--tone-2 {
    background: linear-gradient(155deg, rgba(19, 78, 74, 0.05) 0%, rgba(20, 184, 166, 0.1) 100%);
  }

  &--tone-3 {
    background: linear-gradient(155deg, rgba(74, 29, 106, 0.05) 0%, rgba(167, 139, 250, 0.12) 100%);
  }

  &--tone-4 {
    background: linear-gradient(155deg, rgba(124, 45, 18, 0.05) 0%, rgba(251, 146, 60, 0.12) 100%);
  }

  &--active {
    border-color: rgba(29, 78, 216, 0.35);
    box-shadow:
      0 0 0 2rpx #fff,
      0 0 0 4rpx $cv-primary,
      0 12rpx 32rpx rgba(29, 78, 216, 0.22);

    &.category-root-strip__item--tone-0 {
      background: $cv-cat-1;
    }

    &.category-root-strip__item--tone-1 {
      background: $cv-cat-2;
    }

    &.category-root-strip__item--tone-2 {
      background: $cv-cat-3;
    }

    &.category-root-strip__item--tone-3 {
      background: $cv-cat-4;
    }

    &.category-root-strip__item--tone-4 {
      background: $cv-cat-5;
    }
  }
}

.category-root-strip__icon {
  width: 48rpx;
  height: 48rpx;
  border-radius: 16rpx;
  background: rgba(11, 18, 32, 0.06);
  border: 1rpx solid rgba(11, 18, 32, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12rpx;

  .category-root-strip__item--active & {
    background: rgba(255, 255, 255, 0.14);
    border-color: rgba(255, 255, 255, 0.22);
  }
}

.category-root-strip__name {
  font-size: 26rpx;
  font-weight: 700;
  color: $cv-text;
  letter-spacing: -0.03em;
  line-height: 1.25;

  .category-root-strip__item--active & {
    color: #fff;
  }
}

.category-root-strip__hint {
  display: block;
  margin-top: 6rpx;
  font-size: 20rpx;
  color: $cv-text-muted;
  line-height: 1.3;

  .category-root-strip__item--active & {
    color: rgba(255, 255, 255, 0.72);
  }
}

/** wrap 模式：发布页静态换行 */
.category-root-strip--wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.category-root-strip__pill {
  display: inline-flex;
  align-items: center;
  gap: 10rpx;
  padding: 14rpx 20rpx;
  border-radius: $cv-radius-pill;
  background: $cv-surface-muted;
  border: 1rpx solid $cv-border;
  @include cv-pressable;

  &--active {
    border-color: transparent;
    box-shadow: 0 8rpx 24rpx rgba(11, 18, 32, 0.14);
  }

  &--active.category-root-strip__pill--tone-0 {
    background: $cv-cat-1;
  }

  &--active.category-root-strip__pill--tone-1 {
    background: $cv-cat-2;
  }

  &--active.category-root-strip__pill--tone-2 {
    background: $cv-cat-3;
  }

  &--active.category-root-strip__pill--tone-3 {
    background: $cv-cat-4;
  }

  &--active.category-root-strip__pill--tone-4 {
    background: $cv-cat-5;
  }
}

.category-root-strip__pill-icon {
  width: 36rpx;
  height: 36rpx;
  border-radius: 12rpx;
  background: rgba(11, 18, 32, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;

  .category-root-strip__pill--active & {
    background: rgba(255, 255, 255, 0.14);
  }
}

.category-root-strip__pill-name {
  font-size: 24rpx;
  font-weight: 600;
  color: $cv-text;

  .category-root-strip__pill--active & {
    color: #fff;
  }
}
</style>
