<template>
  <!-- 首页双列信息流卡片：紧凑展示 -->
  <view class="home-tile" @click="emit('click', item)">
    <view class="home-tile__media">
      <image
        v-if="item.images?.length"
        class="home-tile__cover"
        :src="item.images[0]"
        mode="aspectFill"
      />
      <view v-else class="home-tile__placeholder">
        <u-icon name="photo" color="#cbd5e1" size="28" />
      </view>
      <text v-if="item.categoryName" class="home-tile__tag">{{ item.categoryName }}</text>
    </view>
    <view class="home-tile__body">
      <text class="home-tile__title">{{ item.title }}</text>
      <view class="home-tile__foot">
        <text class="home-tile__price">{{ formatPrice(item.price) }}</text>
        <text v-if="item.distanceKm !== undefined" class="home-tile__dist">
          {{ formatDistance(item.distanceKm) }}
        </text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { CityInfoItem } from '@/types/city-info';
import { formatDistance, formatPrice } from '@/utils/format';

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

.home-tile {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: $cv-radius-sm;
  background: $cv-surface;
  border: 1rpx solid $cv-border;
  box-shadow: $cv-shadow-soft;
  @include cv-pressable;
}

.home-tile__media {
  position: relative;
  width: 100%;
  height: 200rpx;
  background: $cv-surface-muted;
}

.home-tile__cover,
.home-tile__placeholder {
  width: 100%;
  height: 100%;
}

.home-tile__placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
}

.home-tile__tag {
  position: absolute;
  left: 12rpx;
  bottom: 12rpx;
  max-width: calc(100% - 24rpx);
  padding: 4rpx 12rpx;
  font-size: 18rpx;
  font-weight: 600;
  color: #fff;
  background: rgba(11, 18, 32, 0.55);
  border-radius: $cv-radius-pill;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.home-tile__body {
  padding: 16rpx 16rpx 18rpx;
}

.home-tile__title {
  display: block;
  font-size: 26rpx;
  font-weight: 700;
  color: $cv-text;
  line-height: 1.35;
  letter-spacing: -0.02em;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  min-height: 70rpx;
}

.home-tile__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8rpx;
  margin-top: 12rpx;
}

.home-tile__price {
  font-size: 28rpx;
  font-weight: 700;
  color: $cv-accent;
  font-variant-numeric: tabular-nums;
}

.home-tile__dist {
  font-size: 20rpx;
  color: $cv-text-muted;
  flex-shrink: 0;
}
</style>
