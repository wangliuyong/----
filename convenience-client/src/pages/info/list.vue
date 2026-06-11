<template>
  <view class="page-list">
    <view class="page-list__filter">
      <u-search v-model="keyword" placeholder="搜索关键词" bg-color="#f0f3f8" :show-action="false" @search="onSearch"
        @custom="onSearch" />
    </view>

    <view class="page-list__sort">
      <u-subsection :list="sortList" :current="sortIndex" active-color="#1d4ed8" @change="onSortChange" />
    </view>

    <scroll-view class="page-list__scroll" scroll-y @scrolltolower="loadMore">
      <InfoCard v-for="item in list" :key="item.id" :item="item" @click="goDetail" />
      <u-empty v-if="!loading && !list.length" mode="search" text="暂无相关信息" />
      <u-loadmore :status="loadStatus" color="#1d4ed8" />
    </scroll-view>
    <AiAssistantFab />
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { queryCityInfoList } from '@/api/city-info.api';
import { queryCollectedIds } from '@/api/collect.api';
import AiAssistantFab from '@/components/AiAssistantFab/AiAssistantFab.vue';
import InfoCard from '@/components/InfoCard/InfoCard.vue';
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

const sortList = [{ name: '最新' }, { name: '距离' }, { name: '价格' }];

onLoad((query) => {
  if (query?.categoryId) categoryId.value = Number(query.categoryId);
  if (query?.title) {
    pageTitle.value = String(query.title);
    uni.setNavigationBarTitle({ title: pageTitle.value });
  }
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
        keyword: keyword.value || undefined,
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

function onSortChange(index: number) {
  sortIndex.value = index;
  sortBy.value = (['latest', 'distance', 'price'] as const)[index];
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
}

.page-list__filter {
  padding: 20rpx 28rpx;
  background: $cv-surface;
  border-bottom: 1rpx solid $cv-border;
}

.page-list__sort {
  background: $cv-surface;
  border-bottom: 1rpx solid $cv-border;
  padding: 12rpx 16rpx;
}

.page-list__scroll {
  flex: 1;
  height: 0;
  min-height: 0;
  padding: 24rpx 28rpx;
  box-sizing: border-box;
}
</style>
