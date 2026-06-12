<template>
  <view
    class="cv-sk-block"
    :class="{ 'cv-sk-block--shimmer': shimmer }"
    :style="blockStyle"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';

/** 骨架屏矩形块：用于图片区、卡片、统计格等 */
const props = withDefaults(
  defineProps<{
    width?: string;
    height?: string;
    radius?: string;
    shimmer?: boolean;
    flex?: string | number;
  }>(),
  {
    width: '100%',
    height: '120rpx',
    radius: '8rpx',
    shimmer: false,
    flex: 'none',
  },
);

const blockStyle = computed(() => ({
  width: props.width,
  height: props.height,
  borderRadius: props.radius,
  flex: props.flex === 'none' ? undefined : String(props.flex),
}));
</script>

<style lang="scss" scoped>
@import '@/styles/skeleton.scss';

.cv-sk-block {
  @include cv-skeleton-base;

  &--shimmer {
    @include cv-skeleton-shimmer;
  }
}

@media (prefers-reduced-motion: reduce) {
  .cv-sk-block--shimmer {
    animation: none;
  }
}
</style>
