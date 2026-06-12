<template>
  <!-- 二级分类网格：双列卡片，信息一目了然 -->
  <view class="category-sub-grid">
    <view
      v-for="(item, index) in list"
      :key="item.id"
      class="category-sub-grid__item"
      :class="{ 'category-sub-grid__item--active': item.id === selectedId }"
      @click="emit('select', item)"
    >
      <view
        class="category-sub-grid__accent"
        :class="`category-sub-grid__accent--${index % 5}`"
      />
      <view class="category-sub-grid__body">
        <text class="category-sub-grid__name">{{ item.name }}</text>
        <text v-if="parentName" class="category-sub-grid__parent">{{ parentName }}</text>
      </view>
      <view class="category-sub-grid__go">
        <u-icon
          :name="selectedId === item.id ? 'checkmark' : 'arrow-right'"
          :color="selectedId === item.id ? '#1d4ed8' : '#8b9bb8'"
          size="14"
        />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { CategoryItem } from '@/types/city-info';

withDefaults(
  defineProps<{
    list: CategoryItem[];
    parentName?: string;
    /** 发布页传入已选二级 id，用于高亮 */
    selectedId?: number;
  }>(),
  {
    parentName: '',
    selectedId: 0,
  },
);

const emit = defineEmits<{
  select: [item: CategoryItem];
}>();
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.category-sub-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14rpx;
}

.category-sub-grid__item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12rpx;
  min-height: 112rpx;
  padding: 20rpx 18rpx;
  border-radius: $cv-radius-sm;
  background: $cv-surface;
  border: 1rpx solid $cv-border;
  box-shadow: $cv-shadow-soft;
  overflow: hidden;
  @include cv-pressable;

  &--active {
    border-color: rgba(29, 78, 216, 0.28);
    background: $cv-primary-soft;
    box-shadow:
      0 0 0 2rpx rgba(29, 78, 216, 0.12),
      $cv-shadow-soft;
  }
}

.category-sub-grid__accent {
  width: 6rpx;
  align-self: stretch;
  border-radius: $cv-radius-pill;
  flex-shrink: 0;

  &--0 {
    background: linear-gradient(180deg, #1d4ed8 0%, #1e3a8a 100%);
  }

  &--1 {
    background: linear-gradient(180deg, #475569 0%, #334155 100%);
  }

  &--2 {
    background: linear-gradient(180deg, #14b8a6 0%, #0f766e 100%);
  }

  &--3 {
    background: linear-gradient(180deg, #a78bfa 0%, #7c3aed 100%);
  }

  &--4 {
    background: linear-gradient(180deg, #fb923c 0%, #c2410c 100%);
  }
}

.category-sub-grid__body {
  flex: 1;
  min-width: 0;
}

.category-sub-grid__name {
  display: block;
  font-size: 28rpx;
  font-weight: 700;
  color: $cv-text;
  letter-spacing: -0.03em;
  line-height: 1.3;
}

.category-sub-grid__parent {
  display: block;
  margin-top: 4rpx;
  font-size: 20rpx;
  color: $cv-text-muted;
}

.category-sub-grid__go {
  width: 44rpx;
  height: 44rpx;
  border-radius: 50%;
  background: $cv-surface-muted;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  .category-sub-grid__item--active & {
    background: rgba(29, 78, 216, 0.12);
  }
}
</style>
