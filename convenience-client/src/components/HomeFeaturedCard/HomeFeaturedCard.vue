<template>
  <!-- 首页精选大卡：横向布局，信息密度高 -->
  <view class="home-featured cv-card" @click="emit('click', item)">
    <view class="home-featured__media">
      <image
        v-if="item.images?.length"
        class="home-featured__cover"
        :src="item.images[0]"
        mode="aspectFill"
      />
      <view v-else class="home-featured__placeholder">
        <u-icon name="photo" color="#cbd5e1" size="40" />
      </view>
      <view class="home-featured__badge">精选</view>
    </view>

    <view class="home-featured__body">
      <text v-if="item.categoryName" class="home-featured__cat">{{ item.categoryName }}</text>
      <text class="home-featured__title">{{ item.title }}</text>
      <view class="home-featured__stats">
        <text class="home-featured__price">{{ formatPrice(item.price) }}</text>
        <view class="home-featured__meta">
          <text v-if="item.distanceKm !== undefined" class="home-featured__meta-item">
            {{ formatDistance(item.distanceKm) }}
          </text>
          <text class="home-featured__meta-item">{{ formatRelativeTime(item.createdAt) }}</text>
        </view>
      </view>
      <view class="home-featured__foot">
        <text class="home-featured__foot-item">{{ item.viewCount }} 浏览</text>
        <text class="home-featured__foot-item">{{ item.collectCount }} 收藏</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { CityInfoItem } from '@/types/city-info';
import { formatDistance, formatPrice, formatRelativeTime } from '@/utils/format';

defineProps<{
  item: CityInfoItem;
}>();

const emit = defineEmits<{
  click: [item: CityInfoItem];
}>();
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.home-featured {
  display: flex;
  gap: 0;
  padding: 0;
  overflow: hidden;
  margin-bottom: 16rpx;
  @include cv-pressable;
}

.home-featured__media {
  position: relative;
  width: 260rpx;
  flex-shrink: 0;
  align-self: stretch;
  min-height: 260rpx;
  background: $cv-surface-muted;
}

.home-featured__cover,
.home-featured__placeholder {
  width: 100%;
  height: 100%;
  min-height: 260rpx;
}

.home-featured__placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
}

.home-featured__badge {
  position: absolute;
  left: 16rpx;
  top: 16rpx;
  padding: 6rpx 14rpx;
  font-size: 20rpx;
  font-weight: 700;
  color: #fff;
  background: $cv-primary;
  border-radius: $cv-radius-pill;
  letter-spacing: 0.02em;
}

.home-featured__body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  padding: 24rpx 24rpx 22rpx;
}

.home-featured__cat {
  font-size: 22rpx;
  font-weight: 600;
  color: $cv-primary;
}

.home-featured__title {
  margin-top: 10rpx;
  font-size: 30rpx;
  font-weight: 700;
  color: $cv-text;
  letter-spacing: -0.03em;
  line-height: 1.35;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.home-featured__stats {
  margin-top: auto;
  padding-top: 16rpx;
}

.home-featured__price {
  display: block;
  font-size: 36rpx;
  font-weight: 700;
  color: $cv-accent;
  letter-spacing: -0.04em;
  font-variant-numeric: tabular-nums;
}

.home-featured__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-top: 8rpx;
}

.home-featured__meta-item {
  font-size: 22rpx;
  color: $cv-text-muted;
}

.home-featured__foot {
  display: flex;
  gap: 20rpx;
  margin-top: 14rpx;
  padding-top: 14rpx;
  border-top: 1rpx solid $cv-border;
}

.home-featured__foot-item {
  font-size: 22rpx;
  color: $cv-text-secondary;
  font-variant-numeric: tabular-nums;
}
</style>
