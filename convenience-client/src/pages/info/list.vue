<template>
  <view class="page-list">
    <!-- 顶部英雄区：标题 + 结果统计 -->
    <view class="page-list__hero">
      <view class="page-list__hero-glow" />
      <view class="page-list__nav">
        <view class="page-list__back" hover-class="page-list__back--pressed" @click="onBack">
          <u-icon name="arrow-left" color="#fff" size="18" />
        </view>
        <view class="page-list__nav-text">
          <text class="page-list__title">{{ pageTitle }}</text>
          <text v-if="!loading || list.length" class="page-list__subtitle">
            {{ resultSummary }}
          </text>
        </view>
      </view>

      <!-- 搜索 -->
      <view class="page-list__search">
        <u-icon name="search" color="#8b9bb8" size="18" />
        <input
          v-model="keyword"
          class="page-list__search-input"
          type="text"
          confirm-type="search"
          placeholder="搜索标题或详情"
          placeholder-class="page-list__search-ph"
          @confirm="onSearch"
        />
        <view v-if="keyword" class="page-list__search-clear" @click="onClearKeyword">
          <u-icon name="close-circle-fill" color="#cbd5e1" size="16" />
        </view>
      </view>

      <!-- 排序：胶囊标签 -->
      <view class="page-list__sort">
        <view
          v-for="(item, index) in sortList"
          :key="item.key"
          class="page-list__sort-item"
          :class="{ 'page-list__sort-item--active': sortIndex === index }"
          @click="onSortChange(index)"
        >
          {{ item.name }}
        </view>
      </view>
    </view>

    <!-- 列表区 -->
    <scroll-view
      class="page-list__scroll"
      scroll-y
      :show-scrollbar="false"
      @scrolltolower="loadMore"
    >
      <view class="page-list__scroll-inner">
        <!-- 骨架屏 -->
        <view v-if="loading && !list.length" class="page-list__skeleton">
          <SkeletonList :count="4" />
        </view>

        <template v-else>
          <InfoListCard
            v-for="item in list"
            :key="item.id"
            :item="item"
            @click="goDetail"
          />
          <u-empty v-if="!list.length" mode="search" text="暂无相关信息" />
        </template>

        <u-loadmore v-if="list.length" :status="loadStatus" color="#1d4ed8" />
      </view>
    </scroll-view>

    <AiAssistantFab />
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { queryCityInfoList } from '@/api/city-info.api';
import { queryCollectedIds } from '@/api/collect.api';
import AiAssistantFab from '@/components/AiAssistantFab/AiAssistantFab.vue';
import InfoListCard from '@/components/InfoListCard/InfoListCard.vue';
import SkeletonList from '@/components/SkeletonList/SkeletonList.vue';
import { useLocationStore } from '@/stores/location';
import type { CityInfoItem } from '@/types/city-info';

const locationStore = useLocationStore();
const list = ref<CityInfoItem[]>([]);
const keyword = ref('');
const categoryId = ref<number>();
const pageTitle = ref('信息列表');
const page = ref(1);
const total = ref(0);
const loading = ref(false);
const loadStatus = ref<'loadmore' | 'loading' | 'nomore'>('loadmore');
const sortIndex = ref(0);
const sortBy = ref<'latest' | 'distance' | 'price'>('latest');
const collectedIds = ref<number[]>([]);

const sortList = [
  { name: '最新', key: 'latest' as const },
  { name: '距离', key: 'distance' as const },
  { name: '价格', key: 'price' as const },
];

/** 结果摘要文案 */
const resultSummary = computed(() => {
  const parts: string[] = [`共 ${total.value} 条`];
  if (keyword.value.trim()) parts.push(`关键词「${keyword.value.trim()}」`);
  return parts.join('，');
});

onLoad((query) => {
  if (query?.categoryId) categoryId.value = Number(query.categoryId);
  if (query?.title) pageTitle.value = String(query.title);
});

async function fetchList(reset = false) {
  if (loading.value) return;
  if (reset) {
    page.value = 1;
    list.value = [];
  }
  loading.value = true;
  loadStatus.value = 'loading';
  try {
    const res = await queryCityInfoList(
      {
        page: page.value,
        pageSize: 10,
        categoryId: categoryId.value,
        keyword: keyword.value.trim() || undefined,
        sortBy: sortBy.value,
      },
      {
        lat: locationStore.latitude,
        lng: locationStore.longitude,
        collectedIds: collectedIds.value,
      },
    );
    list.value = reset ? res.list : [...list.value, ...res.list];
    total.value = res.total;
    loadStatus.value = list.value.length >= total.value ? 'nomore' : 'loadmore';
  } finally {
    loading.value = false;
  }
}

function onSearch() {
  fetchList(true);
}

function onClearKeyword() {
  keyword.value = '';
  fetchList(true);
}

function onSortChange(index: number) {
  if (sortIndex.value === index) return;
  sortIndex.value = index;
  sortBy.value = sortList[index].key;
  fetchList(true);
}

function loadMore() {
  if (loadStatus.value !== 'loadmore') return;
  page.value += 1;
  fetchList(false);
}

function goDetail(item: CityInfoItem) {
  uni.navigateTo({ url: `/pages/info/detail?id=${item.id}` });
}

function onBack() {
  uni.navigateBack({
    fail: () => {
      uni.switchTab({ url: '/pages/home/index' });
    },
  });
}

onMounted(async () => {
  const [, ids] = await Promise.all([
    locationStore.fetchLocation(),
    queryCollectedIds().catch(() => [] as number[]),
  ]);
  collectedIds.value = ids;
  fetchList(true);
});
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.page-list {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: $cv-bg;
  overflow: hidden;
}

.page-list__hero {
  position: relative;
  flex-shrink: 0;
  overflow: hidden;
  @include cv-hero-bg;
  padding: 20rpx $cv-space-page 24rpx;
  padding-top: calc(20rpx + env(safe-area-inset-top));
}

.page-list__hero-glow {
  @include cv-hero-orb(240rpx, -50rpx, -40rpx);
}

.page-list__nav {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-start;
  gap: 16rpx;
  margin-bottom: 20rpx;
}

.page-list__back {
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

.page-list__back--pressed {
  opacity: 0.85;
  transform: scale(0.96);
}

.page-list__nav-text {
  flex: 1;
  min-width: 0;
  padding-top: 4rpx;
}

.page-list__title {
  display: block;
  font-size: 40rpx;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.04em;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.page-list__subtitle {
  display: block;
  margin-top: 8rpx;
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.72);
  line-height: 1.4;
}

.page-list__search {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 18rpx 24rpx;
  border-radius: $cv-radius-pill;
  @include cv-glass;
}

.page-list__search-input {
  flex: 1;
  min-width: 0;
  font-size: 28rpx;
  color: $cv-text;
  height: 44rpx;
  line-height: 44rpx;
}

.page-list__search-ph {
  color: $cv-text-muted;
  font-size: 28rpx;
}

.page-list__search-clear {
  flex-shrink: 0;
  padding: 4rpx;
}

.page-list__sort {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 12rpx;
  margin-top: 18rpx;
}

.page-list__sort-item {
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

.page-list__scroll {
  flex: 1;
  height: 0;
  width: 100%;
}

.page-list__scroll-inner {
  padding: 20rpx $cv-space-page 32rpx;
  box-sizing: border-box;
}

/** 骨架屏容器 */
.page-list__skeleton {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
</style>
