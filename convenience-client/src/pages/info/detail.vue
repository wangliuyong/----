<template>
  <view class="page-detail">
    <!-- 加载骨架：与最终布局同形，避免空白闪烁 -->
    <view v-if="loading" class="page-detail__skeleton">
      <view class="page-detail__sk-hero" />
      <view class="page-detail__sk-sheet">
        <view class="page-detail__sk-line page-detail__sk-line--lg" />
        <view class="page-detail__sk-line page-detail__sk-line--md" />
        <view class="page-detail__sk-grid">
          <view v-for="i in 4" :key="i" class="page-detail__sk-stat" />
        </view>
        <view class="page-detail__sk-block" />
      </view>
    </view>

    <scroll-view v-else-if="detail" scroll-y class="page-detail__scroll" :show-scrollbar="false">
      <!-- 顶部图集：沉浸式轮播 + 浮动导航 -->
      <view class="page-detail__hero">
        <swiper v-if="detail.images.length" class="page-detail__swiper" :current="imageIndex" indicator-dots
          indicator-color="rgba(255,255,255,0.35)" indicator-active-color="#fff" @change="onSwiperChange">
          <swiper-item v-for="(img, idx) in detail.images" :key="idx">
            <image class="page-detail__img" :src="img" mode="aspectFill" @click="preview(idx)" />
          </swiper-item>
        </swiper>
        <view v-else class="page-detail__placeholder">
          <u-icon name="photo" color="#cbd5e1" size="56" />
          <text class="page-detail__placeholder-text">暂无图片</text>
        </view>

        <view class="page-detail__hero-fade" />

        <view class="page-detail__nav" :style="{ paddingTop: statusBarPadding }">
          <view class="page-detail__nav-btn" hover-class="page-detail__nav-btn--pressed" @click="goBack">
            <u-icon name="arrow-left" color="#fff" size="20" />
          </view>
          <view v-if="detail.images.length" class="page-detail__counter">
            {{ imageIndex + 1 }}/{{ detail.images.length }}
          </view>
        </view>
      </view>

      <!-- 缩略图条：多图时快速切换 -->
      <scroll-view v-if="detail.images.length > 1" scroll-x class="page-detail__thumbs" :show-scrollbar="false">
        <view class="page-detail__thumbs-inner">
          <view v-for="(img, idx) in detail.images" :key="idx" class="page-detail__thumb"
            :class="{ 'page-detail__thumb--active': imageIndex === idx }" @click="imageIndex = idx">
            <image class="page-detail__thumb-img" :src="img" mode="aspectFill" />
          </view>
        </view>
      </scroll-view>

      <!-- 主体内容区：圆角 sheet 叠在 hero 上 -->
      <view class="page-detail__sheet">
        <!-- 核心信息卡：分类、标题、价格 -->
        <view class="page-detail__main cv-card">
          <view v-if="detail.categoryName" class="page-detail__cat">{{ detail.categoryName }}</view>
          <text class="page-detail__title">{{ detail.title }}</text>
          <view class="page-detail__price-row">
            <text class="page-detail__price">{{ formatPrice(detail.price) }}</text>
            <text class="page-detail__price-hint">{{ priceHint }}</text>
          </view>
        </view>

        <!-- 数据概览：2x2 网格，关键指标一目了然 -->
        <view class="page-detail__stats">
          <view class="page-detail__stat cv-card">
            <u-icon name="eye" color="#1d4ed8" size="18" />
            <text class="page-detail__stat-val">{{ detail.viewCount }}</text>
            <text class="page-detail__stat-label">浏览</text>
          </view>
          <view class="page-detail__stat cv-card">
            <u-icon name="star" color="#1d4ed8" size="18" />
            <text class="page-detail__stat-val">{{ detail.collectCount }}</text>
            <text class="page-detail__stat-label">收藏</text>
          </view>
          <view class="page-detail__stat cv-card">
            <u-icon name="clock" color="#1d4ed8" size="18" />
            <text class="page-detail__stat-val page-detail__stat-val--sm">{{ publishShort }}</text>
            <text class="page-detail__stat-label">发布</text>
          </view>
          <view class="page-detail__stat cv-card">
            <u-icon name="map" color="#1d4ed8" size="18" />
            <text class="page-detail__stat-val page-detail__stat-val--sm">
              {{ distanceText || '未知' }}
            </text>
            <text class="page-detail__stat-label">距离</text>
          </view>
        </view>

        <!-- 位置信息：可点击打开地图 -->
        <view v-if="detail.address" class="page-detail__loc cv-card" hover-class="page-detail__loc--pressed"
          @click="openMap">
          <view class="page-detail__loc-icon">
            <u-icon name="map-fill" color="#1d4ed8" size="22" />
          </view>
          <view class="page-detail__loc-body">
            <text class="page-detail__loc-title">交易地点</text>
            <text class="page-detail__loc-addr">{{ detail.address }}</text>
            <text v-if="distanceText" class="page-detail__loc-dist">距您约 {{ distanceText }}</text>
          </view>
          <u-icon v-if="hasLocation" name="arrow-right" color="#94a3b8" size="16" />
        </view>

        <!-- 详情描述 -->
        <view class="page-detail__desc cv-card">
          <text class="page-detail__section-title">详情描述</text>
          <text class="page-detail__content">{{ detail.content }}</text>
        </view>

        <!-- 平台审核提示：增强信任感 -->
        <view v-if="detail.auditStatus === 'APPROVED'" class="page-detail__trust">
          <u-icon name="checkmark-circle" color="#16a34a" size="16" />
          <text class="page-detail__trust-text">信息已通过平台审核，请线下交易时注意核实</text>
        </view>

        <view class="page-detail__scroll-pad" />
      </view>
    </scroll-view>

    <!-- 加载失败 -->
    <view v-else class="page-detail__empty">
      <u-icon name="info-circle" color="#94a3b8" size="48" />
      <text class="page-detail__empty-text">信息不存在或已下架</text>
      <u-button type="primary" shape="circle" text="返回" @click="goBack" />
    </view>

    <!-- 底部操作栏 -->
    <view v-if="detail && !loading" class="page-detail__bar">
      <view class="page-detail__bar-collect" :class="{ 'page-detail__bar-collect--on': collected }"
        hover-class="page-detail__bar-collect--pressed" @click="toggleCollect">
        <u-icon :name="collected ? 'star-fill' : 'star'" :color="collected ? '#fff' : '#1d4ed8'" size="20" />
        <text>{{ collected ? '已收藏' : '收藏' }}</text>
      </view>
      <view class="page-detail__bar-action" hover-class="page-detail__bar-action--pressed" @click="goReport">
        <u-icon name="warning" color="#64748b" size="20" />
        <text>举报</text>
      </view>
      <!-- #ifdef MP-WEIXIN -->
      <button class="page-detail__bar-share" open-type="share">
        <u-icon name="share" color="#64748b" size="20" />
        <text>分享</text>
      </button>
      <!-- #endif -->
    </view>

    <AiAssistantFab above-bottom-bar />
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { onLoad, onShareAppMessage } from '@dcloudio/uni-app';
import { queryCityInfoDetail } from '@/api/city-info.api';
import { postCollect, postUncollect, queryCollectedIds } from '@/api/collect.api';
import AiAssistantFab from '@/components/AiAssistantFab/AiAssistantFab.vue';
import { useLocationStore } from '@/stores/location';
import { useUserStore } from '@/stores/user';
import type { CityInfoItem } from '@/types/city-info';
import {
  calcDistanceKm,
  formatDateTime,
  formatDistance,
  formatPrice,
  formatRelativeTime,
} from '@/utils/format';

const userStore = useUserStore();
const locationStore = useLocationStore();

/** 详情数据 */
const detail = ref<CityInfoItem>();
/** 页面加载态 */
const loading = ref(true);
/** 是否已收藏 */
const collected = ref(false);
/** 当前轮播图索引 */
const imageIndex = ref(0);
/** 信息 ID */
let infoId = 0;

/** 状态栏安全区内边距 */
const statusBarPadding = computed(() => {
  const sys = uni.getSystemInfoSync();
  return `${(sys.statusBarHeight || 0) + 8}px`;
});

/** 发布日期短格式 */
const publishShort = computed(() => {
  if (!detail.value) return '';
  return formatDateTime(detail.value.createdAt, 'MM-DD HH:mm');
});

/** 相对发布时间 */
const publishRelative = computed(() => {
  if (!detail.value) return '';
  return formatRelativeTime(detail.value.createdAt);
});

/** 距离文案 */
const distanceText = computed(() => {
  if (detail.value?.distanceKm === undefined) return '';
  return formatDistance(detail.value.distanceKm);
});

/** 是否有经纬度可导航 */
const hasLocation = computed(() => {
  return !!(detail.value?.latitude && detail.value?.longitude);
});

/** 价格补充说明 */
const priceHint = computed(() => {
  if (!detail.value) return '';
  const p = detail.value.price;
  if (p === undefined || p === null) return '价格可议';
  if (p === 0) return '免费赠送';
  return publishRelative.value;
});

onLoad((query) => {
  infoId = Number(query?.id || 0);
});

onShareAppMessage(() => ({
  title: detail.value?.title || '同城便民',
  path: `/pages/info/detail?id=${infoId}`,
  imageUrl: detail.value?.images?.[0],
}));

/** 轮播切换同步缩略图高亮 */
function onSwiperChange(e: { detail: { current: number } }) {
  imageIndex.value = e.detail.current;
}

/** 预览大图 */
function preview(current: number) {
  if (!detail.value?.images.length) return;
  uni.previewImage({ urls: detail.value.images, current });
}

/** 返回上一页 */
function goBack() {
  uni.navigateBack({
    fail: () => uni.switchTab({ url: '/pages/home/index' }),
  });
}

/** 打开地图导航 */
function openMap() {
  if (!detail.value?.latitude || !detail.value?.longitude) return;
  uni.openLocation({
    latitude: detail.value.latitude,
    longitude: detail.value.longitude,
    name: detail.value.title,
    address: detail.value.address || '',
    scale: 16,
  });
}

/** 切换收藏状态 */
async function toggleCollect() {
  if (!userStore.isLoggedIn) {
    uni.navigateTo({ url: '/pages/auth/login' });
    return;
  }
  try {
    if (collected.value) {
      await postUncollect(infoId);
      collected.value = false;
      if (detail.value) detail.value.collectCount = Math.max(0, detail.value.collectCount - 1);
      uni.showToast({ title: '已取消收藏', icon: 'none' });
    } else {
      await postCollect(infoId);
      collected.value = true;
      if (detail.value) detail.value.collectCount += 1;
      uni.showToast({ title: '收藏成功', icon: 'success' });
    }
  } catch (e) {
    uni.showToast({ title: (e as Error).message, icon: 'none' });
  }
}

/** 跳转举报页 */
function goReport() {
  uni.navigateTo({ url: `/pages/report/index?infoId=${infoId}` });
}

/** 拉取详情与收藏状态 */
onMounted(async () => {
  if (!infoId) {
    loading.value = false;
    return;
  }
  try {
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
  } catch {
    detail.value = undefined;
  } finally {
    loading.value = false;
  }
});
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.page-detail {
  min-height: 100vh;
  @include cv-page-ambient;
}

.page-detail__scroll {
  height: 100vh;
}

/* ---------- 骨架屏 ---------- */
.page-detail__skeleton {
  min-height: 100vh;
}

.page-detail__sk-hero {
  height: 560rpx;
  background: linear-gradient(90deg, $cv-surface-muted 25%, #eef2f7 50%, $cv-surface-muted 75%);
  background-size: 200% 100%;
  animation: detail-shimmer 1.4s ease infinite;
}

.page-detail__sk-sheet {
  margin-top: -40rpx;
  padding: 32rpx $cv-space-page;
  border-radius: $cv-radius-sheet $cv-radius-sheet 0 0;
  @include cv-sheet-bg;
}

.page-detail__sk-line {
  height: 32rpx;
  border-radius: 8rpx;
  margin-bottom: 20rpx;
  background: $cv-surface-muted;
  animation: detail-shimmer 1.4s ease infinite;

  &--lg {
    width: 80%;
    height: 44rpx;
  }

  &--md {
    width: 40%;
    height: 48rpx;
  }
}

.page-detail__sk-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16rpx;
  margin: 24rpx 0;
}

.page-detail__sk-stat {
  height: 140rpx;
  border-radius: $cv-radius-card;
  background: $cv-surface-muted;
  animation: detail-shimmer 1.4s ease infinite;
}

.page-detail__sk-block {
  height: 240rpx;
  border-radius: $cv-radius-card;
  background: $cv-surface-muted;
  animation: detail-shimmer 1.4s ease infinite;
}

@keyframes detail-shimmer {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}

/* ---------- 图集 Hero ---------- */
.page-detail__hero {
  position: relative;
  height: 560rpx;
  background: $cv-hero-ink;
}

.page-detail__swiper,
.page-detail__img {
  width: 100%;
  height: 100%;
}

.page-detail__placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  background: $cv-surface-muted;
}

.page-detail__placeholder-text {
  font-size: 26rpx;
  color: $cv-text-muted;
}

.page-detail__hero-fade {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 160rpx;
  background: linear-gradient(to top, rgba(11, 18, 32, 0.55) 0%, transparent 100%);
  pointer-events: none;
}

.page-detail__nav {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: $cv-space-page;
  padding-right: $cv-space-page;
  padding-bottom: 16rpx;
}

.page-detail__nav-btn {
  width: 72rpx;
  height: 72rpx;
  border-radius: 22rpx;
  background: rgba(11, 18, 32, 0.42);
  border: 1rpx solid rgba(255, 255, 255, 0.22);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  @include cv-pressable;
}

.page-detail__nav-btn--pressed {
  opacity: 0.85;
  transform: scale(0.96);
}

.page-detail__counter {
  padding: 10rpx 22rpx;
  border-radius: $cv-radius-pill;
  font-size: 24rpx;
  font-weight: 600;
  color: #fff;
  background: rgba(11, 18, 32, 0.42);
  border: 1rpx solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

/* ---------- 缩略图条 ---------- */
.page-detail__thumbs {
  position: relative;
  z-index: 2;
  margin-top: -48rpx;
  white-space: nowrap;
}

.page-detail__thumbs-inner {
  display: inline-flex;
  gap: 12rpx;
  padding: 0 $cv-space-page 8rpx;
}

.page-detail__thumb {
  width: 112rpx;
  height: 112rpx;
  border-radius: 16rpx;
  overflow: hidden;
  border: 3rpx solid transparent;
  opacity: 0.72;
  transition: opacity 0.22s $cv-ease-out, border-color 0.22s $cv-ease-out;
  flex-shrink: 0;

  &--active {
    opacity: 1;
    border-color: $cv-primary;
    box-shadow: 0 8rpx 24rpx rgba(29, 78, 216, 0.28);
  }
}

.page-detail__thumb-img {
  width: 100%;
  height: 100%;
}

/* ---------- 主体 Sheet ---------- */
.page-detail__sheet {
  position: relative;
  z-index: 1;
  margin-top: -32rpx;
  padding: 8rpx $cv-space-page 0;
  border-radius: $cv-radius-sheet $cv-radius-sheet 0 0;
  @include cv-sheet-bg;
}

.page-detail__main {
  padding: 36rpx 32rpx 32rpx;
  margin-bottom: 20rpx;
}

.page-detail__cat {
  display: inline-flex;
  padding: 8rpx 20rpx;
  margin-bottom: 18rpx;
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
  line-height: 1.28;
  letter-spacing: -0.05em;
}

.page-detail__price-row {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 16rpx;
  margin-top: 24rpx;
  padding-top: 24rpx;
  border-top: 1rpx solid $cv-border;
}

.page-detail__price {
  font-size: 52rpx;
  font-weight: 700;
  color: $cv-accent;
  letter-spacing: -0.05em;
}

.page-detail__price-hint {
  font-size: 24rpx;
  color: $cv-text-muted;
}

/* ---------- 数据网格 ---------- */
.page-detail__stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16rpx;
  margin-bottom: 20rpx;
}

.page-detail__stat {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8rpx;
  padding: 24rpx 28rpx;
}

.page-detail__stat-val {
  font-size: 36rpx;
  font-weight: 700;
  color: $cv-text;
  letter-spacing: -0.03em;
  line-height: 1.1;

  &--sm {
    font-size: 28rpx;
  }
}

.page-detail__stat-label {
  font-size: 22rpx;
  color: $cv-text-muted;
}

/* ---------- 位置卡片 ---------- */
.page-detail__loc {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 28rpx 32rpx;
  margin-bottom: 20rpx;
  @include cv-pressable;
}

.page-detail__loc--pressed {
  opacity: 0.92;
  transform: scale(0.985);
}

.page-detail__loc-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 20rpx;
  background: $cv-primary-soft;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.page-detail__loc-body {
  flex: 1;
  min-width: 0;
}

.page-detail__loc-title {
  display: block;
  font-size: 22rpx;
  color: $cv-text-muted;
  margin-bottom: 6rpx;
}

.page-detail__loc-addr {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  color: $cv-text;
  line-height: 1.45;
}

.page-detail__loc-dist {
  display: block;
  margin-top: 6rpx;
  font-size: 24rpx;
  color: $cv-primary;
}

/* ---------- 详情描述 ---------- */
.page-detail__desc {
  padding: 32rpx;
  margin-bottom: 20rpx;
}

.page-detail__section-title {
  display: block;
  margin-bottom: 20rpx;
  @include cv-section-title;
}

.page-detail__content {
  font-size: 28rpx;
  color: $cv-text-secondary;
  line-height: 1.85;
  white-space: pre-wrap;
}

/* ---------- 信任提示 ---------- */
.page-detail__trust {
  display: flex;
  align-items: flex-start;
  gap: 12rpx;
  padding: 24rpx 28rpx;
  margin-bottom: 20rpx;
  border-radius: $cv-radius-card;
  background: rgba(22, 163, 74, 0.08);
  border: 1rpx solid rgba(22, 163, 74, 0.18);
}

.page-detail__trust-text {
  flex: 1;
  font-size: 24rpx;
  color: #15803d;
  line-height: 1.55;
}

.page-detail__scroll-pad {
  height: calc(140rpx + env(safe-area-inset-bottom));
}

/* ---------- 空状态 ---------- */
.page-detail__empty {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24rpx;
  padding: $cv-space-page;
}

.page-detail__empty-text {
  font-size: 28rpx;
  color: $cv-text-muted;
  margin-bottom: 16rpx;
}

/* ---------- 底部操作栏 ---------- */
.page-detail__bar {
  @include cv-bottom-bar;
  display: flex;
  align-items: center;
  gap: 16rpx;
  z-index: 800;
}

.page-detail__bar-collect {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
  height: 88rpx;
  border-radius: $cv-radius-pill;
  background: $cv-primary-soft;
  border: 1rpx solid rgba(29, 78, 216, 0.2);
  font-size: 28rpx;
  font-weight: 600;
  color: $cv-primary;
  transition: background 0.22s $cv-ease-out, color 0.22s $cv-ease-out;
  @include cv-pressable;

  &--on {
    background: linear-gradient(155deg, $cv-hero-ink 0%, $cv-primary-dark 42%, $cv-primary 100%);
    border-color: transparent;
    color: #fff;
    box-shadow: 0 12rpx 32rpx rgba(29, 78, 216, 0.28);
  }
}

.page-detail__bar-collect--pressed,
.page-detail__bar-action--pressed {
  opacity: 0.9;
  transform: scale(0.98);
}

.page-detail__bar-action,
.page-detail__bar-share {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4rpx;
  width: 96rpx;
  height: 88rpx;
  border-radius: 20rpx;
  background: $cv-surface-muted;
  font-size: 20rpx;
  color: $cv-text-secondary;
  @include cv-pressable;
}

.page-detail__bar-share {
  padding: 0;
  margin: 0;
  line-height: 1;
  border: none;

  &::after {
    border: none;
  }
}
</style>
