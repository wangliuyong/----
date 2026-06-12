<template>
  <view class="page-home">
    <!-- 顶部英雄区 -->
    <view class="page-home__hero">
      <view class="page-home__hero-orb page-home__hero-orb--1" />
      <view class="page-home__hero-orb page-home__hero-orb--2" />
      <view class="page-home__hero-top">
        <view class="page-home__location" @click="onLocationTap">
          <view class="page-home__location-icon">
            <u-icon name="map-fill" color="#fff" size="14" />
          </view>
          <text class="page-home__city">{{ locationStore.cityName }}</text>
          <u-icon name="arrow-down-fill" color="rgba(255,255,255,0.7)" size="10" />
        </view>
      </view>
      <text class="page-home__greeting">发现身边的便民信息</text>
      <text class="page-home__sub">二手、招聘、上门服务，一站浏览</text>
      <view class="page-home__search" @click="goSearch">
        <u-icon name="search" color="#8b9bb8" size="18" />
        <text class="page-home__search-ph">搜索关键词</text>
      </view>
    </view>

    <view class="page-home__body">
      <view v-if="banners.length" class="page-home__swiper-wrap cv-card">
        <u-swiper
          :list="swiperList"
          key-name="image"
          height="300rpx"
          radius="20"
          indicator
          indicator-mode="line"
          :indicator-active-color="primaryColor"
        />
      </view>

      <view v-if="notices.length" class="page-home__notice cv-card" @click="goNotice(notices[0].id)">
        <view class="page-home__notice-tag">公告</view>
        <text class="page-home__notice-text">{{ notices[0].title }}</text>
        <u-icon name="arrow-right" color="#cbd5e1" size="14" />
      </view>

      <view class="cv-section">
        <SectionHead title="热门分类" action-text="全部分类" @action="goCategoryTab" />
        <CategoryGrid :list="homeCategories" @select="onCategorySelect" />
      </view>

      <view class="cv-section">
        <SectionHead title="推荐信息" action-text="查看更多" @action="goList" />
        <InfoCard v-for="item in infoList" :key="item.id" :item="item" @click="goDetail" />
        <u-empty v-if="!loading && !infoList.length" mode="list" text="暂无推荐信息" />
        <u-loadmore v-if="infoList.length" :status="loadStatus" :color="primaryColor" />
      </view>
    </view>

    <!-- #ifndef MP-WEIXIN -->
    <AppTabBar page-path="pages/home/index" />
    <!-- #endif -->
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { queryBannerList } from '@/api/banner.api';
import { queryCategoryTree } from '@/api/category.api';
import { queryCityInfoList } from '@/api/city-info.api';
import { queryCollectedIds } from '@/api/collect.api';
import { queryNoticeList } from '@/api/notice.api';
import AppTabBar from '@/components/AppTabBar/AppTabBar.vue';
import CategoryGrid from '@/components/CategoryGrid/CategoryGrid.vue';
import InfoCard from '@/components/InfoCard/InfoCard.vue';
import SectionHead from '@/components/SectionHead/SectionHead.vue';
import { useTabBarPage } from '@/composables/useTabBarPage';
import { useLocationStore } from '@/stores/location';
import type { BannerItem, CategoryItem, CityInfoItem, NoticeItem } from '@/types/city-info';

useTabBarPage();

const primaryColor = '#1d4ed8';
const locationStore = useLocationStore();
const banners = ref<BannerItem[]>([]);
const notices = ref<NoticeItem[]>([]);
const categories = ref<CategoryItem[]>([]);
const infoList = ref<CityInfoItem[]>([]);
const loading = ref(false);
const loadStatus = ref<'loadmore' | 'loading' | 'nomore'>('loadmore');

const swiperList = computed(() =>
  banners.value.map((b) => ({ image: b.imageUrl, title: '' })),
);

/** 首页仅展示前 8 个一级分类，完整列表见「分类」Tab */
const homeCategories = computed(() => categories.value.slice(0, 8));

/** 加载首页数据 */
async function loadData() {
  loading.value = true;
  loadStatus.value = 'loading';
  try {
    const [bannerRes, noticeRes, categoryRes, collectedIds] = await Promise.all([
      queryBannerList(),
      queryNoticeList(),
      queryCategoryTree(),
      queryCollectedIds().catch(() => [] as number[]),
      locationStore.fetchLocation(),
    ]);
    banners.value = bannerRes;
    notices.value = noticeRes;
    categories.value = categoryRes;
    const page = await queryCityInfoList(
      { page: 1, pageSize: 6, sortBy: 'latest' },
      {
        lat: locationStore.latitude,
        lng: locationStore.longitude,
        collectedIds,
      },
    );
    infoList.value = page.list;
    loadStatus.value = 'nomore';
  } finally {
    loading.value = false;
  }
}

function onLocationTap() {
  uni.showToast({ title: '定位功能开发中', icon: 'none' });
}

function goSearch() {
  uni.navigateTo({ url: '/pages/info/list' });
}

function goCategoryTab() {
  uni.switchTab({ url: '/pages/category/index' });
}

function goNotice(id: number) {
  uni.navigateTo({ url: `/pages/notice/detail?id=${id}` });
}

function onCategorySelect(item: CategoryItem) {
  uni.navigateTo({ url: `/pages/info/list?categoryId=${item.id}&title=${item.name}` });
}

function goList() {
  uni.navigateTo({ url: '/pages/info/list' });
}

function goDetail(item: CityInfoItem) {
  uni.navigateTo({ url: `/pages/info/detail?id=${item.id}` });
}

onMounted(loadData);
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.page-home {
  min-height: 100vh;
  background: $cv-bg;
}

.page-home__hero {
  position: relative;
  overflow: hidden;
  @include cv-hero-bg;
  padding: 28rpx $cv-space-page 52rpx;
  padding-top: calc(28rpx + env(safe-area-inset-top));
}

.page-home__hero-orb--1 {
  @include cv-hero-orb(340rpx, -80rpx, -70rpx);
}

.page-home__hero-orb--2 {
  position: absolute;
  width: 160rpx;
  height: 160rpx;
  left: -30rpx;
  bottom: 40rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.04);
  border: 1rpx solid rgba(255, 255, 255, 0.1);
  pointer-events: none;
}

.page-home__hero-top {
  position: relative;
  z-index: 1;
}

.page-home__location {
  display: inline-flex;
  align-items: center;
  gap: 10rpx;
  padding: 12rpx 20rpx 12rpx 14rpx;
  background: rgba(255, 255, 255, 0.1);
  border: 1rpx solid rgba(255, 255, 255, 0.18);
  border-radius: $cv-radius-pill;
  backdrop-filter: blur(12px);
  @include cv-pressable;
}

.page-home__location-icon {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.14);
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-home__city {
  font-size: 28rpx;
  color: #fff;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.page-home__greeting {
  position: relative;
  z-index: 1;
  display: block;
  margin-top: 40rpx;
  font-size: 46rpx;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.04em;
  line-height: 1.18;
}

.page-home__sub {
  position: relative;
  z-index: 1;
  display: block;
  margin-top: 14rpx;
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.45;
}

.page-home__search {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 14rpx;
  margin-top: 32rpx;
  padding: 26rpx 30rpx;
  border-radius: $cv-radius-pill;
  @include cv-glass;
  @include cv-pressable;
}

.page-home__search-ph {
  flex: 1;
  font-size: 28rpx;
  color: $cv-text-muted;
}

.page-home__body {
  @include cv-body-sheet;
}

.page-home__swiper-wrap {
  overflow: hidden;
  padding: 12rpx;
}

.page-home__notice {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-top: 20rpx;
  padding: 26rpx 30rpx;
  @include cv-pressable;
}

.page-home__notice-tag {
  flex-shrink: 0;
  padding: 8rpx 16rpx;
  font-size: 22rpx;
  font-weight: 600;
  color: $cv-accent;
  background: $cv-accent-soft;
  border-radius: $cv-radius-sm;
}

.page-home__notice-text {
  flex: 1;
  font-size: 26rpx;
  font-weight: 500;
  color: $cv-text;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
