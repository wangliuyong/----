<template>
  <view class="page-collect">
    <!-- 顶部英雄区：标题 + 收藏概览 -->
    <view class="page-collect__hero">
      <view class="page-collect__hero-glow" />
      <view class="page-collect__nav">
        <view class="page-collect__back" hover-class="page-collect__back--pressed" @click="onBack">
          <u-icon name="arrow-left" color="#fff" size="18" />
        </view>
        <view class="page-collect__nav-text">
          <text class="page-collect__title">我的收藏</text>
          <text v-if="!loading" class="page-collect__subtitle">{{ summaryText }}</text>
        </view>
      </view>

      <!-- 数据概览 -->
      <view v-if="!loading && list.length" class="page-collect__stats">
        <view class="page-collect__stat">
          <text class="page-collect__stat-val">{{ list.length }}</text>
          <text class="page-collect__stat-label">全部</text>
        </view>
        <view class="page-collect__stat">
          <text class="page-collect__stat-val">{{ categoryCount }}</text>
          <text class="page-collect__stat-label">分类</text>
        </view>
        <view class="page-collect__stat">
          <text class="page-collect__stat-val">{{ weekCount }}</text>
          <text class="page-collect__stat-label">近7天</text>
        </view>
      </view>

      <!-- 排序胶囊 -->
      <view v-if="list.length" class="page-collect__sort">
        <view
          v-for="(item, index) in sortList"
          :key="item.key"
          class="page-collect__sort-item"
          :class="{ 'page-collect__sort-item--active': sortIndex === index }"
          @click="onSortChange(index)"
        >
          {{ item.name }}
        </view>
      </view>
    </view>

    <!-- 列表区 -->
    <scroll-view scroll-y class="page-collect__scroll" :show-scrollbar="false">
      <view class="page-collect__scroll-inner">
        <!-- 骨架屏 -->
        <view v-if="loading" class="page-collect__skeleton">
          <view v-for="i in 4" :key="i" class="page-collect__sk-card">
            <view class="page-collect__sk-media" />
            <view class="page-collect__sk-body">
              <view class="page-collect__sk-line page-collect__sk-line--short" />
              <view class="page-collect__sk-line page-collect__sk-line--long" />
              <view class="page-collect__sk-line page-collect__sk-line--mid" />
            </view>
          </view>
        </view>

        <!-- 收藏列表 -->
        <template v-else-if="sortedList.length">
          <InfoListCard
            v-for="item in sortedList"
            :key="item.id"
            :item="item"
            @click="goDetail"
          />
        </template>

        <!-- 空状态 -->
        <view v-else class="page-collect__empty cv-card">
          <u-icon name="star" color="#cbd5e1" size="56" />
          <text class="page-collect__empty-title">还没有收藏</text>
          <text class="page-collect__empty-desc">浏览同城信息，点击收藏随时回看</text>
          <u-button type="primary" shape="circle" text="去逛逛" @click="goHome" />
        </view>
      </view>
    </scroll-view>

    <AiAssistantFab />
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { queryCollectList } from '@/api/collect.api';
import AiAssistantFab from '@/components/AiAssistantFab/AiAssistantFab.vue';
import InfoListCard from '@/components/InfoListCard/InfoListCard.vue';
import { useLocationStore } from '@/stores/location';
import type { CityInfoItem } from '@/types/city-info';
import { calcDistanceKm } from '@/utils/format';

/** 收藏条目：附带收藏时间与距离 */
interface CollectRow extends CityInfoItem {
  collectedAt?: string;
}

const locationStore = useLocationStore();
const list = ref<CollectRow[]>([]);
const loading = ref(true);
const sortIndex = ref(0);

const sortList = [
  { key: 'latest', name: '最近收藏' },
  { key: 'price', name: '价格' },
  { key: 'views', name: '浏览量' },
] as const;

/** 结果摘要 */
const summaryText = computed(() => {
  if (!list.value.length) return '收藏的信息会显示在这里';
  const cats = new Set(list.value.map((i) => i.categoryName).filter(Boolean));
  return `共 ${list.value.length} 条，覆盖 ${cats.size} 个分类`;
});

/** 涉及分类数 */
const categoryCount = computed(() => {
  return new Set(list.value.map((i) => i.categoryName).filter(Boolean)).size;
});

/** 近 7 天新增收藏数 */
const weekCount = computed(() => {
  const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return list.value.filter((i) => {
    if (!i.collectedAt) return false;
    return new Date(i.collectedAt).getTime() >= cutoff;
  }).length;
});

/** 排序后的列表 */
const sortedList = computed(() => {
  const rows = [...list.value];
  const key = sortList[sortIndex.value]?.key || 'latest';
  if (key === 'price') {
    return rows.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
  }
  if (key === 'views') {
    return rows.sort((a, b) => b.viewCount - a.viewCount);
  }
  return rows.sort(
    (a, b) => new Date(b.collectedAt || 0).getTime() - new Date(a.collectedAt || 0).getTime(),
  );
});

function onSortChange(index: number) {
  sortIndex.value = index;
}

function onBack() {
  uni.navigateBack({ fail: () => uni.switchTab({ url: '/pages/mine/index' }) });
}

function goDetail(item: CityInfoItem) {
  uni.navigateTo({ url: `/pages/info/detail?id=${item.id}` });
}

function goHome() {
  uni.switchTab({ url: '/pages/home/index' });
}

/** 拉取收藏并附加距离 */
async function loadCollects() {
  loading.value = true;
  try {
    const res = await queryCollectList(1, 50);
    list.value = res.list
      .map((c) => {
        if (!c.info) return null;
        const row: CollectRow = {
          ...c.info,
          collected: true,
          collectedAt: c.createdAt,
        };
        if (row.latitude && row.longitude) {
          row.distanceKm = calcDistanceKm(
            locationStore.latitude,
            locationStore.longitude,
            row.latitude,
            row.longitude,
          );
        }
        return row;
      })
      .filter(Boolean) as CollectRow[];
  } finally {
    loading.value = false;
  }
}

onMounted(loadCollects);
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.page-collect {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: $cv-bg;
  overflow: hidden;
}

.page-collect__hero {
  position: relative;
  flex-shrink: 0;
  overflow: hidden;
  @include cv-hero-bg;
  padding: 20rpx $cv-space-page 24rpx;
  padding-top: calc(20rpx + env(safe-area-inset-top));
}

.page-collect__hero-glow {
  @include cv-hero-orb(220rpx, -40rpx, -30rpx);
}

.page-collect__nav {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-start;
  gap: 16rpx;
  margin-bottom: 20rpx;
}

.page-collect__back {
  width: 64rpx;
  height: 64rpx;
  border-radius: 20rpx;
  background: rgba(255, 255, 255, 0.12);
  border: 1rpx solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.page-collect__back--pressed {
  opacity: 0.85;
  transform: scale(0.96);
}

.page-collect__nav-text {
  flex: 1;
  min-width: 0;
  padding-top: 4rpx;
}

.page-collect__title {
  display: block;
  font-size: 40rpx;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.04em;
  line-height: 1.2;
}

.page-collect__subtitle {
  display: block;
  margin-top: 8rpx;
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.72);
  line-height: 1.4;
}

.page-collect__stats {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12rpx;
  margin-bottom: 18rpx;
}

.page-collect__stat {
  padding: 20rpx 16rpx;
  border-radius: 20rpx;
  background: rgba(255, 255, 255, 0.1);
  border: 1rpx solid rgba(255, 255, 255, 0.14);
  text-align: center;
}

.page-collect__stat-val {
  display: block;
  font-size: 36rpx;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.03em;
  line-height: 1.1;
}

.page-collect__stat-label {
  display: block;
  margin-top: 6rpx;
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.68);
}

.page-collect__sort {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 12rpx;
}

.page-collect__sort-item {
  padding: 12rpx 28rpx;
  border-radius: $cv-radius-pill;
  font-size: 24rpx;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.72);
  background: rgba(255, 255, 255, 0.1);
  border: 1rpx solid rgba(255, 255, 255, 0.14);
  @include cv-pressable;

  &--active {
    color: $cv-primary;
    background: #fff;
    border-color: #fff;
    box-shadow: 0 8rpx 24rpx rgba(11, 18, 32, 0.12);
  }
}

.page-collect__scroll {
  flex: 1;
  height: 0;
  width: 100%;
}

.page-collect__scroll-inner {
  padding: 20rpx $cv-space-page 32rpx;
  box-sizing: border-box;
}

.page-collect__skeleton {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.page-collect__sk-card {
  display: flex;
  overflow: hidden;
  border-radius: $cv-radius-sm;
  background: $cv-surface;
  border: 1rpx solid $cv-border;
}

.page-collect__sk-media {
  width: 200rpx;
  min-height: 200rpx;
  flex-shrink: 0;
  background: linear-gradient(
    90deg,
    $cv-surface-muted 0%,
    rgba(240, 243, 248, 0.5) 50%,
    $cv-surface-muted 100%
  );
  background-size: 200% 100%;
  animation: collect-shimmer 1.2s ease-in-out infinite;
}

.page-collect__sk-body {
  flex: 1;
  padding: 24rpx;
  display: flex;
  flex-direction: column;
  gap: 14rpx;
}

.page-collect__sk-line {
  height: 24rpx;
  border-radius: 8rpx;
  background: $cv-surface-muted;

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
}

@keyframes collect-shimmer {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: -100% 0;
  }
}

.page-collect__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 64rpx 40rpx;
  text-align: center;
}

.page-collect__empty-title {
  margin-top: 24rpx;
  font-size: 32rpx;
  font-weight: 700;
  color: $cv-text;
}

.page-collect__empty-desc {
  margin: 12rpx 0 32rpx;
  font-size: 26rpx;
  color: $cv-text-secondary;
  line-height: 1.5;
  max-width: 420rpx;
}

@media (prefers-reduced-motion: reduce) {
  .page-collect__sk-media {
    animation: none;
  }
}
</style>
