<template>
  <view class="info-card" @click="onClick">
    <view v-if="item.images?.length" class="info-card__media">
      <image class="info-card__cover" :src="item.images[0]" mode="aspectFill" />
      <view class="info-card__overlay" />
      <view v-if="item.categoryName" class="info-card__tag">{{ item.categoryName }}</view>
    </view>
    <view v-else class="info-card__media info-card__media--placeholder">
      <u-icon name="photo" color="#cbd5e1" size="36" />
      <view v-if="item.categoryName" class="info-card__tag">{{ item.categoryName }}</view>
    </view>

    <view class="info-card__body">
      <text class="info-card__title">{{ item.title }}</text>
      <view class="info-card__footer">
        <text class="info-card__price">{{ formatPrice(item.price) }}</text>
        <view class="info-card__meta">
          <text v-if="item.distanceKm !== undefined" class="info-card__distance">
            {{ formatDistance(item.distanceKm) }}
          </text>
          <text class="info-card__time">{{ formatRelativeTime(item.createdAt) }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { CityInfoItem } from '@/types/city-info';
import { formatDistance, formatPrice, formatRelativeTime } from '@/utils/format';

const props = defineProps<{
  item: CityInfoItem;
}>();

const emit = defineEmits<{
  click: [item: CityInfoItem];
}>();

function onClick() {
  emit('click', props.item);
}
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

/** 杂志式竖版卡片 */
.info-card {
  margin-bottom: 24rpx;
  overflow: hidden;
  @include cv-card;
  @include cv-pressable;
}

.info-card__media {
  position: relative;
  width: 100%;
  height: 300rpx;
  background: $cv-surface-muted;
  overflow: hidden;
}

.info-card__media--placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
}

.info-card__cover {
  width: 100%;
  height: 100%;
}

.info-card__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 55%, rgba(11, 18, 32, 0.35) 100%);
  pointer-events: none;
}

.info-card__tag {
  position: absolute;
  left: 20rpx;
  bottom: 20rpx;
  padding: 8rpx 18rpx;
  font-size: 22rpx;
  font-weight: 600;
  color: #fff;
  background: rgba(11, 18, 32, 0.5);
  backdrop-filter: blur(10px);
  border-radius: $cv-radius-pill;
  letter-spacing: 0.02em;
}

.info-card__body {
  padding: 28rpx 30rpx 32rpx;
}

.info-card__title {
  display: block;
  font-size: 32rpx;
  font-weight: 700;
  color: $cv-text;
  line-height: 1.4;
  letter-spacing: -0.03em;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.info-card__footer {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-top: 22rpx;
  gap: 16rpx;
}

.info-card__price {
  font-size: 38rpx;
  font-weight: 700;
  color: $cv-accent;
  letter-spacing: -0.04em;
  font-variant-numeric: tabular-nums;
}

.info-card__meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4rpx;
}

.info-card__distance,
.info-card__time {
  font-size: 22rpx;
  color: $cv-text-muted;
}
</style>
