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
        <u-icon name="star-fill" :color="CV_PRIMARY" size="12" />
      </view>
      <view class="info-list-card__media-shade" />
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
import { CV_PRIMARY } from '@/constants/theme';
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
  position: relative;
  display: flex;
  gap: 0;
  padding: 0;
  overflow: hidden;
  margin-bottom: 20rpx;
  @include cv-pressable;
  @include cv-editorial-card-accent;
}

.info-list-card__media {
  position: relative;
  width: 208rpx;
  flex-shrink: 0;
  align-self: stretch;
  min-height: 208rpx;
  background: $cv-surface-muted;
  border-radius: $cv-radius-card 0 0 $cv-radius-card;
  overflow: hidden;
}

.info-list-card__media-shade {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(145deg, rgba(29, 78, 216, 0.1) 0%, transparent 55%);
  z-index: 1;
}

.info-list-card__cover,
.info-list-card__placeholder {
  width: 100%;
  height: 100%;
  min-height: 208rpx;
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
  box-shadow: 0 4rpx 16rpx rgba(29, 78, 216, 0.14);
  z-index: 2;
}

.info-list-card__body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  padding: 22rpx 24rpx 20rpx 28rpx;
}

.info-list-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12rpx;
  margin-bottom: 8rpx;
}

.info-list-card__cat {
  padding: 4rpx 14rpx;
  border-radius: $cv-radius-pill;
  font-size: 20rpx;
  font-weight: 600;
  color: $cv-primary;
  background: rgba(29, 78, 216, 0.08);
  border: 1rpx solid rgba(29, 78, 216, 0.12);
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
