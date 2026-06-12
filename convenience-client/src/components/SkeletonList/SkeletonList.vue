<template>
  <view class="cv-sk-list">
    <SkeletonListCard v-for="i in count" :key="i" />
  </view>
</template>

<script setup lang="ts">
import SkeletonListCard from '@/components/SkeletonListCard/SkeletonListCard.vue';

/** 纵向列表骨架：默认 4 条卡片 */
withDefaults(
  defineProps<{
    count?: number;
  }>(),
  {
    count: 4,
  },
);
</script>

<style lang="scss" scoped>
.cv-sk-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
</style>
