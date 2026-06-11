<template>
  <view v-if="detail" class="page-detail">
    <swiper v-if="detail.images.length" class="page-detail__swiper" indicator-dots
      indicator-color="rgba(255,255,255,0.35)" indicator-active-color="#fff">
      <swiper-item v-for="(img, idx) in detail.images" :key="idx">
        <image class="page-detail__img" :src="img" mode="aspectFill" @click="preview(idx)" />
      </swiper-item>
    </swiper>
    <view v-else class="page-detail__placeholder">
      <u-icon name="photo" color="#cbd5e1" size="48" />
    </view>

    <view class="page-detail__card">
      <view v-if="detail.categoryName" class="page-detail__tag">{{ detail.categoryName }}</view>
      <text class="page-detail__title">{{ detail.title }}</text>
      <text class="page-detail__price">{{ formatPrice(detail.price) }}</text>
      <view class="page-detail__meta">
        <text>{{ formatRelativeTime(detail.createdAt) }}</text>
        <text>浏览 {{ detail.viewCount }}</text>
      </view>
      <text v-if="detail.address" class="page-detail__address">
        {{ detail.address }}
        <text v-if="detail.distanceKm !== undefined"> · {{ formatDistance(detail.distanceKm) }}</text>
      </text>
    </view>

    <view class="page-detail__card">
      <view class="page-detail__section-head">
        <view class="page-detail__rule" />
        <text class="page-detail__section-title">详情描述</text>
      </view>
      <text class="page-detail__content">{{ detail.content }}</text>
    </view>

    <view class="page-detail__bar">
      <u-button type="primary" plain shape="circle" :text="collected ? '已收藏' : '收藏'" @click="toggleCollect" />
      <u-button type="warning" plain shape="circle" text="举报" @click="goReport" />
      <!-- #ifdef MP-WEIXIN -->
      <u-button shape="circle" text="分享" />
      <!-- #endif -->
    </view>
  </view>
  <u-loading-page v-else loading loading-text="加载中..." />
    <AiAssistantFab />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { onLoad, onShareAppMessage } from '@dcloudio/uni-app';
import { queryCityInfoDetail } from '@/api/city-info.api';
import { postCollect, postUncollect, queryCollectedIds } from '@/api/collect.api';
import AiAssistantFab from '@/components/AiAssistantFab/AiAssistantFab.vue';
import { useLocationStore } from '@/stores/location';
import { useUserStore } from '@/stores/user';
import type { CityInfoItem } from '@/types/city-info';
import { calcDistanceKm, formatDistance, formatPrice, formatRelativeTime } from '@/utils/format';

const userStore = useUserStore();
const locationStore = useLocationStore();
const detail = ref<CityInfoItem>();
const collected = ref(false);
let infoId = 0;

onLoad((query) => {
  infoId = Number(query?.id || 0);
});

onShareAppMessage(() => ({
  title: detail.value?.title || '同城便民',
  path: `/pages/info/detail?id=${infoId}`,
}));

function preview(current: number) {
  if (!detail.value?.images.length) return;
  uni.previewImage({ urls: detail.value.images, current });
}

async function toggleCollect() {
  if (!userStore.isLoggedIn) {
    uni.navigateTo({ url: '/pages/auth/login' });
    return;
  }
  try {
    if (collected.value) {
      await postUncollect(infoId);
      collected.value = false;
      uni.showToast({ title: '已取消收藏', icon: 'none' });
    } else {
      await postCollect(infoId);
      collected.value = true;
      uni.showToast({ title: '收藏成功', icon: 'success' });
    }
  } catch (e) {
    uni.showToast({ title: (e as Error).message, icon: 'none' });
  }
}

function goReport() {
  uni.navigateTo({ url: `/pages/report/index?infoId=${infoId}` });
}

onMounted(async () => {
  if (!infoId) return;
  detail.value = await queryCityInfoDetail(infoId);
  if (detail.value.latitude && detail.value.longitude) {
    detail.value.distanceKm = calcDistanceKm(
      locationStore.latitude,
      locationStore.longitude,
      detail.value.latitude,
      detail.value.longitude,
    );
  }
  const ids = await queryCollectedIds().catch(() => []);
  collected.value = ids.includes(infoId);
});
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.page-detail {
  padding-bottom: calc(140rpx + env(safe-area-inset-bottom));
  background: $cv-bg;
}

.page-detail__swiper {
  height: 540rpx;
}

.page-detail__img {
  width: 100%;
  height: 100%;
}

.page-detail__placeholder {
  height: 420rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $cv-surface-muted;
}

.page-detail__card {
  margin: 24rpx $cv-space-page;
  padding: 36rpx 32rpx;
  @include cv-card;
}

.page-detail__tag {
  display: inline-flex;
  padding: 8rpx 18rpx;
  margin-bottom: 20rpx;
  font-size: 22rpx;
  font-weight: 600;
  color: $cv-primary;
  background: $cv-primary-soft;
  border-radius: $cv-radius-pill;
}

.page-detail__title {
  display: block;
  font-size: 44rpx;
  font-weight: 700;
  color: $cv-text;
  line-height: 1.25;
  letter-spacing: -0.05em;
}

.page-detail__price {
  display: block;
  margin-top: 24rpx;
  font-size: 48rpx;
  color: $cv-accent;
  font-weight: 700;
  letter-spacing: -0.05em;
}

.page-detail__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
  margin-top: 20rpx;
  font-size: 24rpx;
  color: $cv-text-muted;
}

.page-detail__address {
  display: block;
  margin-top: 14rpx;
  font-size: 26rpx;
  color: $cv-text-secondary;
  line-height: 1.5;
}

.page-detail__section-head {
  margin-bottom: 20rpx;
}

.page-detail__rule {
  width: 44rpx;
  height: 4rpx;
  margin-bottom: 14rpx;
  border-radius: 2rpx;
  background: linear-gradient(90deg, $cv-primary 0%, rgba(29, 78, 216, 0.15) 100%);
}

.page-detail__section-title {
  font-size: 32rpx;
  font-weight: 700;
  color: $cv-text;
  letter-spacing: -0.03em;
}

.page-detail__content {
  font-size: 28rpx;
  color: $cv-text-secondary;
  line-height: 1.85;
  white-space: pre-wrap;
}

.page-detail__bar {
  @include cv-bottom-bar;
  display: flex;
  gap: 16rpx;
}
</style>
