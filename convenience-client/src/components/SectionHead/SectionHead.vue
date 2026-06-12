<template>
  <view class="section-head">
    <view class="section-head__left">
      <view class="section-head__rule" />
      <text class="section-head__title">{{ title }}</text>
    </view>
    <view v-if="actionText" class="section-head__action" @click="emit('action')">
      <text>{{ actionText }}</text>
      <u-icon name="arrow-right" :color="primaryColor" size="12" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { CV_PRIMARY } from '@/constants/theme';

/** 钴蓝主色，与 tokens 同步供 u-icon 使用 */
const primaryColor = CV_PRIMARY;

defineProps<{
  title: string;
  actionText?: string;
}>();

const emit = defineEmits<{
  action: [];
}>();
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.section-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 26rpx;
}

.section-head__left {
  flex: 1;
  min-width: 0;
}

.section-head__rule {
  width: 44rpx;
  height: 4rpx;
  margin-bottom: 14rpx;
  border-radius: 2rpx;
  background: linear-gradient(90deg, $cv-primary 0%, rgba(29, 78, 216, 0.12) 100%);
}

.section-head__title {
  @include cv-section-title;
}

.section-head__action {
  display: flex;
  align-items: center;
  gap: 6rpx;
  font-size: 26rpx;
  color: $cv-primary;
  font-weight: 500;
  padding: 8rpx 0;
  flex-shrink: 0;
  @include cv-pressable;
}
</style>
