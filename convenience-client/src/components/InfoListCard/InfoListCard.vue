<template>
  <!-- 列表页横向卡片：一屏扫读标题、价格、距离与互动数据 -->
  <view class="info-list-card cv-card" @click="emit('click', item)">
    <view class="info-list-card__media">
      <image
        v-if="item.images?.length"
        class="info-list-card__cover"
        :src="item.images[0]"
        mode="aspectFill"
      />
      <view v-else class="info-list-card__placeholder">
        <u-icon name="photo" color="#cbd5e1" size="32" />
      </view>
      <view v-if="item.collected" class="info-list-card__fav">
        <u-icon name="star-fill" color="#1d4ed8" size="12" />
      </view>
    </view>

    <view class="info-list-card__body">
      <view class="info-list-card__head">
        <text v-if="item.categoryName" class="info-list-card__cat">{{ item.categoryName }}</text>
        <text class="info-list-card__time">{{ formatRelativeTime(item.createdAt) }}</text>
      </view>
      <text class="info-list-card__title">{{ item.title }}</text>
      <view class="info-list-card__row">
        <text class="info-list-card__price">{{ formatPrice(item.price) }}</text>
        <text v-if="item.distanceKm !== undefined" class="info-list-card__dist">
          {{ formatDistance(item.distanceKm) }}
        </text>
      </view>
      <view class="info-list-card__foot">
        <text class="info-list-card__stat">{{ item.viewCount }} 浏览</text>
        <text class="info-list-card__stat">{{ item.collectCount }} 收藏</text>
        <text v-if="item.address" class="info-list-card__addr">{{ item.address }}</text>
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

.info-list-card {
  display: flex;
  gap: 0;
  padding: 0;
  overflow: hidden;
  margin-bottom: 16rpx;
  @include cv-pressable;
}

.info-list-card__media {
  position: relative;
  width: 200rpx;
  flex-shrink: 0;
  align-self: stretch;
  min-height: 200rpx;
  background: $cv-surface-muted;
}

.info-list-card__cover,
.info-list-card__placeholder {
  width: 100%;
  height: 100%;
  min-height: 200rpx;
}

.info-list-card__placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
}

.info-list-card__fav {
  position: absolute;
  right: 10rpx;
  top: 10rpx;
  width: 36rpx;
  height: 36rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 12rpx rgba(11, 18, 32, 0.12);
}

.info-list-card__body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  padding: 20rpx 22rpx 18rpx;
}

.info-list-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12rpx;
  margin-bottom: 8rpx;
}

.info-list-card__cat {
  font-size: 22rpx;
  font-weight: 600;
  color: $cv-primary;
  flex-shrink: 0;
}

.info-list-card__time {
  font-size: 20rpx;
  color: $cv-text-muted;
  flex-shrink: 0;
}

.info-list-card__title {
  font-size: 28rpx;
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

.info-list-card__row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12rpx;
  margin-top: 12rpx;
}

.info-list-card__price {
  font-size: 32rpx;
  font-weight: 700;
  color: $cv-accent;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.03em;
}

.info-list-card__dist {
  font-size: 22rpx;
  color: $cv-text-secondary;
  font-weight: 500;
  flex-shrink: 0;
}

.info-list-card__foot {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16rpx;
  margin-top: auto;
  padding-top: 12rpx;
}

.info-list-card__stat {
  font-size: 20rpx;
  color: $cv-text-muted;
  font-variant-numeric: tabular-nums;
}

.info-list-card__addr {
  flex: 1;
  min-width: 0;
  font-size: 20rpx;
  color: $cv-text-muted;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: right;
}
</style>
