<template>
  <view
    class="cv-sk-line"
    :class="[
      `cv-sk-line--${variant}`,
      { 'cv-sk-line--shimmer': shimmer },
    ]"
    :style="customStyle"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';

/** 骨架屏文本行：short / mid / long / lg 四种预设宽度 */
const props = withDefaults(
  defineProps<{
    variant?: 'short' | 'mid' | 'long' | 'lg';
    shimmer?: boolean;
    /** 自定义高度，如 32rpx */
    height?: string;
    /** 自定义宽度，如 80% */
    width?: string;
  }>(),
  {
    variant: 'mid',
    shimmer: false,
  },
);

const customStyle = computed(() => {
  const style: Record<string, string> = {};
  if (props.height) style.height = props.height;
  if (props.width) style.width = props.width;
  return style;
});
</script>

<style lang="scss" scoped>
@import '@/styles/skeleton.scss';

.cv-sk-line {
  height: 24rpx;
  @include cv-skeleton-base;

  &--short {
    width: 40%;
  }

  &--mid {
    width: 60%;
  }

  &--long {
    width: 90%;
    height: 32rpx;
  }

  &--lg {
    width: 100%;
    height: 40rpx;
  }

  &--shimmer {
    @include cv-skeleton-shimmer;
  }
}

@media (prefers-reduced-motion: reduce) {
  .cv-sk-line--shimmer {
    animation: none;
  }
}
</style>
