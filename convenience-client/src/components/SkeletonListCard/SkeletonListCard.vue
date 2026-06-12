<template>
  <view class="cv-sk-list-card">
    <SkeletonBlock
      class="cv-sk-list-card__media"
      width="200rpx"
      height="200rpx"
      radius="0"
      :shimmer="true"
    />
    <view class="cv-sk-list-card__body">
      <SkeletonLine variant="short" />
      <SkeletonLine variant="long" />
      <SkeletonLine variant="mid" />
    </view>
  </view>
</template>

<script setup lang="ts">
import SkeletonBlock from '@/components/SkeletonBlock/SkeletonBlock.vue';
import SkeletonLine from '@/components/SkeletonLine/SkeletonLine.vue';
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';

/** 列表卡片骨架：左图右文，与 InfoListCard 同形 */
.cv-sk-list-card {
  display: flex;
  overflow: hidden;
  border-radius: $cv-radius-sm;
  background: $cv-surface;
  border: 1rpx solid $cv-border;
}

.cv-sk-list-card__media {
  flex-shrink: 0;
  min-height: 200rpx;
}

.cv-sk-list-card__body {
  flex: 1;
  padding: 24rpx;
  display: flex;
  flex-direction: column;
  gap: 14rpx;
}
</style>
