<template>
  <view class="page-mine cv-page">
    <!-- 顶部用户区 -->
    <view class="page-mine__header">
      <view class="page-mine__glow page-mine__glow--1" />
      <view class="page-mine__glow page-mine__glow--2" />
      <view class="page-mine__header-inner" @click="onHeaderClick">
        <view class="page-mine__avatar-wrap">
          <u-avatar :src="userStore.profile?.avatar" size="72" />
          <view v-if="userStore.isLoggedIn" class="page-mine__status-dot" />
        </view>
        <view class="page-mine__info">
          <text class="page-mine__name">{{ userStore.nickname }}</text>
          <text v-if="userStore.isLoggedIn" class="page-mine__meta">
            {{ maskedPhone || '未绑定手机' }}
            <text v-if="joinLabel" class="page-mine__meta-sep">|</text>
            {{ joinLabel }}
          </text>
          <text v-else class="page-mine__meta">登录后同步收藏与发布记录</text>
        </view>
        <view class="page-mine__arrow">
          <u-icon name="arrow-right" color="#fff" size="16" />
        </view>
      </view>
    </view>

    <view class="page-mine__body">
      <!-- 数据加载骨架（已登录时） -->
      <template v-if="loading && userStore.isLoggedIn">
        <view class="page-mine__stats cv-card--elevated page-mine__stats--sk">
          <SkeletonBlock v-for="i in 3" :key="i" height="80rpx" radius="12rpx" :shimmer="true" flex="1" />
        </view>
        <view class="page-mine__actions">
          <view v-for="i in 3" :key="i" class="page-mine__action cv-card page-mine__action--sk">
            <SkeletonBlock width="72rpx" height="72rpx" radius="22rpx" :shimmer="true" />
            <view class="page-mine__action-text">
              <SkeletonLine variant="short" />
              <SkeletonLine variant="mid" />
            </view>
          </view>
        </view>
        <view class="page-mine__recent">
          <SkeletonLine variant="short" width="160rpx" />
          <view class="page-mine__recent-block cv-card page-mine__recent-block--sk">
            <SkeletonList :count="2" />
          </view>
        </view>
      </template>

      <template v-else>
      <!-- 未登录引导 -->
      <view v-if="!userStore.isLoggedIn" class="page-mine__login cv-card--elevated">
        <view class="page-mine__login-icon">
          <u-icon name="account-fill" color="#1d4ed8" size="28" />
        </view>
        <view class="page-mine__login-text">
          <text class="page-mine__login-title">登录同城便民</text>
          <text class="page-mine__login-desc">发布信息、收藏关注、AI 问答</text>
        </view>
        <u-button type="primary" text="去登录" size="small" shape="circle" @click="goLogin" />
      </view>

      <!-- 数据概览：真实数字一眼可读 -->
      <view class="page-mine__stats cv-card--elevated">
        <view class="page-mine__stat" @click="goPage('/pages/mine/collect')">
          <text class="page-mine__stat-value">{{ statText(overview.collectCount) }}</text>
          <text class="page-mine__stat-label">收藏</text>
        </view>
        <view class="page-mine__stat-divider" />
        <view class="page-mine__stat" @click="openPublishPage()">
          <view class="page-mine__stat-value-row">
            <text class="page-mine__stat-value">{{ statText(overview.publishCount) }}</text>
            <text v-if="overview.pendingCount > 0" class="page-mine__stat-badge">
              {{ overview.pendingCount }}待审
            </text>
          </view>
          <text class="page-mine__stat-label">发布</text>
        </view>
        <view class="page-mine__stat-divider" />
        <view class="page-mine__stat" @click="goPage('/pages/ai/history')">
          <text class="page-mine__stat-value">{{ statText(overview.aiSessionCount) }}</text>
          <text class="page-mine__stat-label">AI 会话</text>
        </view>
      </view>

      <!-- 快捷入口 Bento -->
      <view class="page-mine__actions">
        <view v-for="action in quickActions" :key="action.key" class="page-mine__action cv-card"
          :class="[`page-mine__action--${action.tone}`]" @click="action.onTap">
          <view class="page-mine__action-icon">
            <u-icon :name="action.icon" color="#fff" size="20" />
          </view>
          <view class="page-mine__action-text">
            <text class="page-mine__action-title">{{ action.title }}</text>
            <text class="page-mine__action-desc">{{ action.desc }}</text>
          </view>
          <u-icon name="arrow-right" color="#cbd5e1" size="14" />
        </view>
      </view>

      <!-- 最近动态 -->
      <view v-if="userStore.isLoggedIn && hasRecent" class="page-mine__recent">
        <view class="page-mine__recent-head">
          <text class="page-mine__recent-title">最近动态</text>
        </view>

        <view v-if="recentCollects.length" class="page-mine__recent-block cv-card">
          <view class="page-mine__recent-label">
            <u-icon name="star-fill" color="#1d4ed8" size="14" />
            <text>最近收藏</text>
          </view>
          <view v-for="item in recentCollects" :key="`c-${item.id}`" class="page-mine__recent-item"
            @click="goDetail(item)">
            <image v-if="item.images?.[0]" class="page-mine__recent-thumb" :src="item.images[0]" mode="aspectFill" />
            <view v-else class="page-mine__recent-thumb page-mine__recent-thumb--empty">
              <u-icon name="photo" color="#cbd5e1" size="18" />
            </view>
            <view class="page-mine__recent-main">
              <text class="page-mine__recent-name">{{ item.title }}</text>
              <text class="page-mine__recent-sub">
                {{ formatPrice(item.price) }} · {{ formatRelativeTime(item.createdAt) }}
              </text>
            </view>
            <u-icon name="arrow-right" color="#cbd5e1" size="12" />
          </view>
        </view>

        <view v-if="recentPosts.length" class="page-mine__recent-block cv-card">
          <view class="page-mine__recent-label">
            <u-icon name="file-text-fill" color="#1d4ed8" size="14" />
            <text>最近发布</text>
          </view>
          <view v-for="item in recentPosts" :key="`p-${item.id}`" class="page-mine__recent-item"
            @click="goDetail(item)">
            <image v-if="item.images?.[0]" class="page-mine__recent-thumb" :src="item.images[0]" mode="aspectFill" />
            <view v-else class="page-mine__recent-thumb page-mine__recent-thumb--empty">
              <u-icon name="photo" color="#cbd5e1" size="18" />
            </view>
            <view class="page-mine__recent-main">
              <text class="page-mine__recent-name">{{ item.title }}</text>
              <view class="page-mine__recent-sub-row">
                <text class="page-mine__recent-sub">{{ formatRelativeTime(item.createdAt) }}</text>
                <text class="page-mine__audit-tag" :class="`page-mine__audit-tag--${item.auditStatus.toLowerCase()}`">
                  {{ AUDIT_STATUS_LABEL[item.auditStatus] }}
                </text>
              </view>
            </view>
            <u-icon name="arrow-right" color="#cbd5e1" size="12" />
          </view>
        </view>
      </view>

      <!-- 底部信息 -->
      <view class="page-mine__about cv-card">
        <text class="page-mine__about-title">同城便民</text>
        <text class="page-mine__about-ver">{{ appVersion }}</text>
      </view>

      <view v-if="userStore.isLoggedIn" class="page-mine__logout">
        <u-button type="error" plain text="退出登录" shape="circle" @click="onLogout" />
      </view>
      </template>
    </view>

    <AppTabBar page-path="pages/mine/index" />
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { postLogout } from '@/api/auth.api';
import { queryCollectList } from '@/api/collect.api';
import { queryMyCityInfoList } from '@/api/city-info.api';
import { queryMineOverview } from '@/api/mine.api';
import type { MineOverview } from '@/api/mine.api';
import AppTabBar from '@/components/AppTabBar/AppTabBar.vue';
import SkeletonBlock from '@/components/SkeletonBlock/SkeletonBlock.vue';
import SkeletonLine from '@/components/SkeletonLine/SkeletonLine.vue';
import SkeletonList from '@/components/SkeletonList/SkeletonList.vue';
import { AI_PAGE_PATH, isTabBarPath, openPublishPage } from '@/constants/tabbar';
import { useTabBarPage } from '@/composables/useTabBarPage';
import { useUserStore } from '@/stores/user';
import type { CityInfoItem } from '@/types/city-info';
import {
  AUDIT_STATUS_LABEL,
  formatDateTime,
  formatPhoneMask,
  formatPrice,
  formatRelativeTime,
} from '@/utils/format';

useTabBarPage();

const userStore = useUserStore();
const appVersion = 'v1.0.0';
const loading = ref(true);

const overview = ref<MineOverview>({
  collectCount: 0,
  publishCount: 0,
  pendingCount: 0,
  aiSessionCount: 0,
});

const recentCollects = ref<CityInfoItem[]>([]);
const recentPosts = ref<CityInfoItem[]>([]);

/** 脱敏手机号 */
const maskedPhone = computed(() => formatPhoneMask(userStore.profile?.phone));

/** 加入时间文案 */
const joinLabel = computed(() => {
  const createdAt = userStore.profile?.createdAt;
  if (!createdAt) return '';
  return `${formatDateTime(createdAt, 'YYYY年M月')}加入`;
});

/** 是否有最近动态可展示 */
const hasRecent = computed(
  () => recentCollects.value.length > 0 || recentPosts.value.length > 0,
);

/** 快捷入口配置 */
const quickActions = computed(() => [
  {
    key: 'collect',
    title: '我的收藏',
    desc: '浏览关注的信息',
    icon: 'star-fill',
    tone: 'blue',
    onTap: () => goPage('/pages/mine/collect'),
  },
  {
    key: 'publish',
    title: '发布信息',
    desc: overview.value.pendingCount
      ? `${overview.value.pendingCount} 条待审核`
      : '填写同城便民信息',
    icon: 'plus-circle-fill',
    tone: 'ink',
    onTap: () => openPublishPage(),
  },
  {
    key: 'ai',
    title: 'AI 助手',
    desc: '办事指南',
    icon: 'chat-fill',
    tone: 'teal',
    onTap: () => uni.switchTab({ url: `/${AI_PAGE_PATH}` }),
  },
  {
    key: 'profile',
    title: '账号设置',
    desc: '昵称、头像与手机号',
    icon: 'setting-fill',
    tone: 'slate',
    onTap: () => goPage('/pages/mine/profile'),
  },
]);

/** 统计数字展示：未登录显示占位符 */
function statText(value: number): string {
  if (!userStore.isLoggedIn) return '-';
  return String(value);
}

function goLogin() {
  uni.navigateTo({ url: '/pages/auth/login' });
}

function onHeaderClick() {
  if (userStore.isLoggedIn) {
    uni.navigateTo({ url: '/pages/mine/profile' });
  } else {
    goLogin();
  }
}

function goPage(url: string) {
  if (isTabBarPath(url)) {
    uni.switchTab({ url: url.startsWith('/') ? url : `/${url}` });
    return;
  }
  if (!userStore.isLoggedIn && !url.includes('/pages/mine/profile')) {
    goLogin();
    return;
  }
  uni.navigateTo({ url });
}

function goDetail(item: CityInfoItem) {
  uni.navigateTo({ url: `/pages/info/detail?id=${item.id}` });
}

/** 加载概览与最近动态 */
async function loadMineData() {
  if (!userStore.isLoggedIn) {
    overview.value = {
      collectCount: 0,
      publishCount: 0,
      pendingCount: 0,
      aiSessionCount: 0,
    };
    recentCollects.value = [];
    recentPosts.value = [];
    loading.value = false;
    return;
  }

  loading.value = true;
  try {
    const [stats, collectRes, postRes] = await Promise.all([
      queryMineOverview(),
      queryCollectList(1, 2),
      queryMyCityInfoList(1, 2),
    ]);
    overview.value = stats;
    recentCollects.value = collectRes.list
      .map((c) => c.info)
      .filter(Boolean) as CityInfoItem[];
    recentPosts.value = postRes.list;
  } finally {
    loading.value = false;
  }
}

async function onLogout() {
  await postLogout();
  userStore.logout();
  await loadMineData();
  uni.showToast({ title: '已退出', icon: 'success' });
}

onMounted(loadMineData);
onShow(loadMineData);
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.page-mine__header {
  position: relative;
  overflow: hidden;
  padding: 48rpx $cv-space-page 56rpx;
  padding-top: calc(36rpx + env(safe-area-inset-top));
  @include cv-hero-bg;
}

.page-mine__glow {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.06);
  border: 1rpx solid rgba(255, 255, 255, 0.12);
  pointer-events: none;
}

.page-mine__glow--1 {
  width: 280rpx;
  height: 280rpx;
  right: -60rpx;
  top: -40rpx;
}

.page-mine__glow--2 {
  width: 140rpx;
  height: 140rpx;
  left: -30rpx;
  bottom: 0;
}

.page-mine__header-inner {
  position: relative;
  display: flex;
  align-items: center;
  gap: 24rpx;
  z-index: 1;
  @include cv-pressable;
}

.page-mine__avatar-wrap {
  position: relative;
  padding: 4rpx;
  border-radius: 50%;
  border: 2rpx solid rgba(255, 255, 255, 0.28);
  box-shadow: 0 12rpx 32rpx rgba(0, 0, 0, 0.18);
}

.page-mine__status-dot {
  position: absolute;
  right: 6rpx;
  bottom: 6rpx;
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  background: #22c55e;
  border: 2rpx solid #fff;
}

.page-mine__info {
  flex: 1;
  min-width: 0;
}

.page-mine__name {
  display: block;
  font-size: 42rpx;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.05em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.page-mine__meta {
  display: block;
  margin-top: 10rpx;
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.78);
  line-height: 1.45;
}

.page-mine__meta-sep {
  margin: 0 10rpx;
  opacity: 0.5;
}

.page-mine__arrow {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  border: 1rpx solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.page-mine__body {
  @include cv-body-sheet;
  margin-top: -36rpx;
}

/** 未登录引导卡 */
.page-mine__login {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 28rpx 28rpx;
  margin-bottom: 20rpx;
}

.page-mine__login-icon {
  width: 72rpx;
  height: 72rpx;
  border-radius: 22rpx;
  background: $cv-primary-soft;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.page-mine__login-text {
  flex: 1;
  min-width: 0;
}

.page-mine__login-title {
  display: block;
  font-size: 30rpx;
  font-weight: 700;
  color: $cv-text;
}

.page-mine__login-desc {
  display: block;
  margin-top: 6rpx;
  font-size: 24rpx;
  color: $cv-text-muted;
}

/** 数据概览 */
.page-mine__stats {
  display: flex;
  align-items: stretch;
  padding: 32rpx 12rpx 28rpx;
}

.page-mine__stat {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  @include cv-pressable;
}

.page-mine__stat-value-row {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.page-mine__stat-value {
  font-size: 40rpx;
  font-weight: 700;
  color: $cv-text;
  letter-spacing: -0.04em;
  font-variant-numeric: tabular-nums;
  line-height: 1.1;
}

.page-mine__stat-badge {
  padding: 4rpx 12rpx;
  border-radius: $cv-radius-pill;
  font-size: 18rpx;
  font-weight: 600;
  color: $cv-accent;
  background: $cv-accent-soft;
}

.page-mine__stat-label {
  font-size: 24rpx;
  color: $cv-text-muted;
}

.page-mine__stat-divider {
  width: 1rpx;
  background: $cv-border-strong;
  margin: 8rpx 0;
}

/** 快捷入口 2x2 */
.page-mine__actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16rpx;
  margin-top: 20rpx;
}

.page-mine__action {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 24rpx 20rpx;
  @include cv-pressable;
}

.page-mine__action-icon {
  width: 64rpx;
  height: 64rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.page-mine__action--blue .page-mine__action-icon {
  background: linear-gradient(155deg, $cv-hero-ink 0%, $cv-primary 100%);
}

.page-mine__action--ink .page-mine__action-icon {
  background: $cv-cat-1;
}

.page-mine__action--teal .page-mine__action-icon {
  background: $cv-cat-3;
}

.page-mine__action--slate .page-mine__action-icon {
  background: $cv-cat-2;
}

.page-mine__action-text {
  flex: 1;
  min-width: 0;
}

.page-mine__action-title {
  display: block;
  font-size: 28rpx;
  font-weight: 700;
  color: $cv-text;
  letter-spacing: -0.02em;
}

.page-mine__action-desc {
  display: block;
  margin-top: 6rpx;
  font-size: 22rpx;
  color: $cv-text-muted;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/** 最近动态 */
.page-mine__recent {
  margin-top: 32rpx;
}

.page-mine__recent-head {
  margin-bottom: 16rpx;
}

.page-mine__recent-title {
  font-size: 30rpx;
  font-weight: 700;
  color: $cv-text;
  letter-spacing: -0.03em;
}

.page-mine__recent-block {
  padding: 8rpx 0;
  margin-bottom: 16rpx;
  overflow: hidden;
}

.page-mine__recent-label {
  display: flex;
  align-items: center;
  gap: 10rpx;
  padding: 20rpx 28rpx 12rpx;
  font-size: 24rpx;
  font-weight: 600;
  color: $cv-text-secondary;
}

.page-mine__recent-item {
  display: flex;
  align-items: center;
  gap: 18rpx;
  padding: 18rpx 28rpx;
  @include cv-pressable;

  &:not(:last-child) {
    border-bottom: 1rpx solid $cv-border;
  }
}

.page-mine__recent-thumb {
  width: 88rpx;
  height: 88rpx;
  border-radius: 16rpx;
  flex-shrink: 0;
  background: $cv-surface-muted;
}

.page-mine__recent-thumb--empty {
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-mine__recent-main {
  flex: 1;
  min-width: 0;
}

.page-mine__recent-name {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  color: $cv-text;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.page-mine__recent-sub {
  display: block;
  margin-top: 6rpx;
  font-size: 22rpx;
  color: $cv-text-muted;
}

.page-mine__recent-sub-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-top: 6rpx;
}

.page-mine__audit-tag {
  padding: 2rpx 12rpx;
  border-radius: $cv-radius-pill;
  font-size: 20rpx;
  font-weight: 600;

  &--pending {
    color: $cv-accent;
    background: $cv-accent-soft;
  }

  &--approved {
    color: #15803d;
    background: #f0fdf4;
  }

  &--rejected {
    color: #dc2626;
    background: #fef2f2;
  }
}

.page-mine__about {
  margin-top: 24rpx;
  padding: 28rpx 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-mine__about-title {
  font-size: 28rpx;
  font-weight: 600;
  color: $cv-text;
}

.page-mine__about-ver {
  font-size: 24rpx;
  color: $cv-text-muted;
}

.page-mine__logout {
  margin-top: 32rpx;
  padding-bottom: 16rpx;
}

.page-mine__stats--sk {
  display: flex;
  gap: 24rpx;
  padding: 32rpx 24rpx;
}

.page-mine__action--sk {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 28rpx 24rpx;
}

.page-mine__recent-block--sk {
  margin-top: 16rpx;
  padding: 0;
  overflow: hidden;
  border: none;
  background: transparent;
  box-shadow: none;
}
</style>
