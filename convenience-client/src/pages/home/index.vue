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
          <text class="page-home__city">{{ locationStore.locating ? '定位中...' : locationStore.cityName }}</text>
          <u-icon name="arrow-down-fill" color="rgba(255,255,255,0.7)" size="10" />
        </view>
      </view>
      <text class="page-home__greeting">发现身边的便民信息</text>
      <text class="page-home__sub">二手、招聘、上门服务，一站浏览</text>
      <view class="page-home__search" @click="goSearch">
        <u-icon name="search" color="#8b9bb8" size="18" />
        <text class="page-home__search-ph">搜索关键词</text>
      </view>

      <!-- 数据概览：同城信息规模一目了然 -->
      <view v-if="!loading" class="page-home__stats">
        <view class="page-home__stat">
          <text class="page-home__stat-num">{{ totalInfoCount }}</text>
          <text class="page-home__stat-label">条信息</text>
        </view>
        <view class="page-home__stat-line" />
        <view class="page-home__stat">
          <text class="page-home__stat-num">{{ categories.length }}</text>
          <text class="page-home__stat-label">个大类</text>
        </view>
        <view class="page-home__stat-line" />
        <view class="page-home__stat">
          <text class="page-home__stat-num">{{ totalSubCount }}</text>
          <text class="page-home__stat-label">个子类</text>
        </view>
      </view>
      <view v-else class="page-home__stats page-home__stats--skeleton">
        <view v-for="i in 3" :key="i" class="page-home__stat-sk" />
      </view>
    </view>

    <view class="page-home__body">
      <!-- 快捷入口 Bento -->
      <HomeQuickActions
        @publish="goPublish"
        @ai="goAi"
        @category="goCategoryTab"
        @search="goSearch"
      />

      <!-- 轮播 + 公告：加载中显示骨架 -->
      <view v-if="loading" class="page-home__promo">
        <SkeletonBlock height="280rpx" radius="20rpx" :shimmer="true" />
        <view class="page-home__notice-sk cv-card">
          <SkeletonLine variant="short" />
          <SkeletonLine variant="long" height="28rpx" />
          <SkeletonLine variant="mid" />
        </view>
      </view>
      <view v-else-if="banners.length || notices.length" class="page-home__promo">
        <view v-if="banners.length" class="page-home__swiper-wrap cv-card">
          <u-swiper
            :list="swiperList"
            key-name="image"
            height="280rpx"
            radius="20"
            indicator
            indicator-mode="line"
            :indicator-active-color="primaryColor"
          />
        </view>
        <view v-if="notices.length" class="page-home__notice cv-card" @click="goNotice(notices[0].id)">
          <view class="page-home__notice-head">
            <view class="page-home__notice-tag">公告</view>
            <text class="page-home__notice-time">{{ formatNoticeDate(notices[0].createdAt) }}</text>
          </view>
          <text class="page-home__notice-text">{{ notices[0].title }}</text>
          <view class="page-home__notice-go">
            <text>查看详情</text>
            <u-icon name="arrow-right" color="#1d4ed8" size="12" />
          </view>
        </view>
      </view>

      <!-- 热门分类 -->
      <view class="cv-section">
        <SectionHead title="热门分类" action-text="全部分类" @action="goCategoryTab" />
        <view v-if="loading" class="page-home__cat-sk">
          <SkeletonBlock
            v-for="i in 8"
            :key="i"
            width="calc(25% - 12rpx)"
            height="140rpx"
            radius="20rpx"
            :shimmer="true"
          />
        </view>
        <CategoryGrid v-else :list="homeCategories" @select="onCategorySelect" />
      </view>

      <!-- 最新推荐：精选 + 双列网格 -->
      <view class="cv-section">
        <SectionHead title="最新推荐" :action-text="`共 ${totalInfoCount} 条`" @action="goList" />
        <view v-if="loading" class="page-home__feed-sk">
          <SkeletonBlock height="320rpx" radius="20rpx" :shimmer="true" />
          <view class="page-home__grid-sk">
            <SkeletonBlock
              v-for="i in 6"
              :key="i"
              height="280rpx"
              radius="16rpx"
              :shimmer="true"
            />
          </view>
        </view>
        <template v-else>
          <HomeFeaturedCard
            v-if="featuredInfo"
            :item="featuredInfo"
            @click="goDetail"
          />
          <view v-if="gridInfoList.length" class="page-home__grid">
            <HomeInfoTile
              v-for="item in gridInfoList"
              :key="item.id"
              :item="item"
              @click="goDetail"
            />
          </view>
          <u-empty v-if="!featuredInfo && !gridInfoList.length" mode="list" text="暂无推荐信息" />
          <view v-if="infoList.length" class="page-home__more" @click="goList">
            <text>查看更多同城信息</text>
            <u-icon name="arrow-right" color="#1d4ed8" size="14" />
          </view>
        </template>
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
import HomeFeaturedCard from '@/components/HomeFeaturedCard/HomeFeaturedCard.vue';
import HomeInfoTile from '@/components/HomeInfoTile/HomeInfoTile.vue';
import SkeletonBlock from '@/components/SkeletonBlock/SkeletonBlock.vue';
import SkeletonLine from '@/components/SkeletonLine/SkeletonLine.vue';
import HomeQuickActions from '@/components/HomeQuickActions/HomeQuickActions.vue';
import SectionHead from '@/components/SectionHead/SectionHead.vue';
import { openPublishPage } from '@/constants/tabbar';
import { useLocationAction } from '@/composables/useLocationAction';
import { useTabBarPage } from '@/composables/useTabBarPage';
import { useLocationStore } from '@/stores/location';
import type { BannerItem, CategoryItem, CityInfoItem, NoticeItem } from '@/types/city-info';

useTabBarPage();

const primaryColor = '#1d4ed8';
const locationStore = useLocationStore();
const { openLocationPicker } = useLocationAction(() => loadData());
const banners = ref<BannerItem[]>([]);
const notices = ref<NoticeItem[]>([]);
const categories = ref<CategoryItem[]>([]);
const infoList = ref<CityInfoItem[]>([]);
const totalInfoCount = ref(0);
const loading = ref(true);

const swiperList = computed(() =>
  banners.value.map((b) => ({ image: b.imageUrl, title: '' })),
);

/** 首页仅展示前 8 个一级分类 */
const homeCategories = computed(() => categories.value.slice(0, 8));

/** 全部子分类数量 */
const totalSubCount = computed(() =>
  categories.value.reduce((sum, root) => sum + (root.children?.length || 0), 0),
);

/** 精选：列表第一条 */
const featuredInfo = computed(() => infoList.value[0] || null);

/** 双列网格：第 2-7 条 */
const gridInfoList = computed(() => infoList.value.slice(1, 7));

/** 格式化公告日期 */
function formatNoticeDate(iso?: string) {
  if (!iso) return '';
  const d = new Date(iso);
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}

/** 加载首页数据 */
async function loadData() {
  loading.value = true;
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
      { page: 1, pageSize: 7, sortBy: 'latest' },
      {
        lat: locationStore.latitude,
        lng: locationStore.longitude,
        collectedIds,
      },
    );
    infoList.value = page.list;
    totalInfoCount.value = page.total;
  } finally {
    loading.value = false;
  }
}

function onLocationTap() {
  openLocationPicker();
}

function goSearch() {
  uni.navigateTo({ url: '/pages/info/list' });
}

function goPublish() {
  openPublishPage();
}

function goAi() {
  uni.switchTab({ url: '/pages/ai/index' });
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
  @include cv-page-ambient;
}

.page-home__hero {
  position: relative;
  overflow: hidden;
  @include cv-hero-bg;
  @include cv-hero-fade-bottom;
  padding: 28rpx $cv-space-page 44rpx;
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
  margin-top: 36rpx;
  font-size: 44rpx;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.04em;
  line-height: 1.18;
}

.page-home__sub {
  position: relative;
  z-index: 1;
  display: block;
  margin-top: 12rpx;
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
  margin-top: 28rpx;
  padding: 24rpx 28rpx;
  border-radius: $cv-radius-pill;
  @include cv-glass;
  @include cv-pressable;
}

.page-home__search-ph {
  flex: 1;
  font-size: 28rpx;
  color: $cv-text-muted;
}

/** 英雄区数据概览 */
.page-home__stats {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 24rpx;
  padding: 20rpx 28rpx;
  border-radius: $cv-radius-sm;
  background: rgba(255, 255, 255, 0.1);
  border: 1rpx solid rgba(255, 255, 255, 0.16);
}

.page-home__stats--skeleton {
  gap: 16rpx;
}

.page-home__stat {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rpx;
}

.page-home__stat-num {
  font-size: 34rpx;
  font-weight: 700;
  color: #fff;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.04em;
  line-height: 1;
}

.page-home__stat-label {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.72);
}

.page-home__stat-line {
  width: 1rpx;
  height: 36rpx;
  background: rgba(255, 255, 255, 0.18);
  flex-shrink: 0;
}

.page-home__stat-sk {
  flex: 1;
  height: 56rpx;
  border-radius: 12rpx;
  background: rgba(255, 255, 255, 0.08);
}

.page-home__body {
  @include cv-body-sheet;
}

.page-home__promo {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  margin-bottom: 8rpx;
}

.page-home__swiper-wrap {
  overflow: hidden;
  padding: 10rpx;
}

.page-home__notice {
  padding: 24rpx 26rpx;
  @include cv-pressable;
}

.page-home__notice-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12rpx;
}

.page-home__notice-tag {
  padding: 6rpx 14rpx;
  font-size: 22rpx;
  font-weight: 600;
  color: $cv-accent;
  background: $cv-accent-soft;
  border-radius: $cv-radius-sm;
}

.page-home__notice-time {
  font-size: 22rpx;
  color: $cv-text-muted;
  font-variant-numeric: tabular-nums;
}

.page-home__notice-text {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  color: $cv-text;
  line-height: 1.45;
  letter-spacing: -0.02em;
}

.page-home__notice-go {
  display: flex;
  align-items: center;
  gap: 6rpx;
  margin-top: 16rpx;
  font-size: 24rpx;
  font-weight: 600;
  color: $cv-primary;
}

.page-home__notice-sk {
  padding: 24rpx 26rpx;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.page-home__cat-sk {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.page-home__feed-sk {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.page-home__grid-sk {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16rpx;
}

.page-home__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14rpx;
}

.page-home__more {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  margin-top: 24rpx;
  padding: 24rpx;
  border-radius: $cv-radius-pill;
  background: $cv-surface;
  border: 1rpx solid $cv-border;
  font-size: 28rpx;
  font-weight: 600;
  color: $cv-primary;
  @include cv-pressable;
}
</style>
