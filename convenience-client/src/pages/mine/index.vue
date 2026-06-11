<template>
  <view class="page-mine cv-page">
    <view class="page-mine__header">
      <view class="page-mine__glow" />
      <view class="page-mine__header-inner" @click="onHeaderClick">
        <view class="page-mine__avatar-wrap">
          <u-avatar :src="userStore.profile?.avatar" size="72" />
        </view>
        <view class="page-mine__info">
          <text class="page-mine__name">{{ userStore.nickname }}</text>
          <text class="page-mine__tip">
            {{ userStore.isLoggedIn ? '管理个人资料与偏好' : '登录后发布与收藏' }}
          </text>
        </view>
        <view class="page-mine__arrow">
          <u-icon name="arrow-right" color="#fff" size="16" />
        </view>
      </view>
    </view>

    <view class="page-mine__body">
      <view class="page-mine__stats cv-card--elevated">
        <view class="page-mine__stat" @click="goPage('/pages/mine/collect')">
          <text class="page-mine__stat-num">收藏</text>
          <text class="page-mine__stat-label">我的关注</text>
        </view>
        <view class="page-mine__stat-divider" />
        <view class="page-mine__stat" @click="goPage('/pages/ai/history')">
          <text class="page-mine__stat-num">AI</text>
          <text class="page-mine__stat-label">历史会话</text>
        </view>
        <view class="page-mine__stat-divider" />
        <view class="page-mine__stat" @click="goPage('/pages/publish/index')">
          <text class="page-mine__stat-num">发布</text>
          <text class="page-mine__stat-label">便民信息</text>
        </view>
      </view>

      <view class="page-mine__menu">
        <view class="cv-menu-group">
          <view class="cv-menu-item" @click="goPage('/pages/mine/profile')">
            <view class="cv-menu-item__icon">
              <u-icon name="edit-pen" color="#1d4ed8" size="20" />
            </view>
            <text class="cv-menu-item__label">编辑资料</text>
            <u-icon name="arrow-right" color="#cbd5e1" size="14" />
          </view>
          <view class="cv-menu-item" @click="goPage('/pages/mine/collect')">
            <view class="cv-menu-item__icon">
              <u-icon name="star" color="#1d4ed8" size="20" />
            </view>
            <text class="cv-menu-item__label">我的收藏</text>
            <u-icon name="arrow-right" color="#cbd5e1" size="14" />
          </view>
          <view class="cv-menu-item" @click="goPage('/pages/ai/history')">
            <view class="cv-menu-item__icon">
              <u-icon name="chat" color="#1d4ed8" size="20" />
            </view>
            <text class="cv-menu-item__label">AI 历史</text>
            <u-icon name="arrow-right" color="#cbd5e1" size="14" />
          </view>
        </view>
      </view>

      <view class="page-mine__about cv-card">
        <text class="page-mine__about-title">同城便民</text>
        <text class="page-mine__about-ver">{{ appVersion }}</text>
      </view>

      <view v-if="userStore.isLoggedIn" class="page-mine__logout">
        <u-button type="error" plain text="退出登录" shape="circle" @click="onLogout" />
      </view>
    </view>

    <!-- #ifndef MP-WEIXIN -->
    <AppTabBar />
    <!-- #endif -->
  </view>
</template>

<script setup lang="ts">
import { postLogout } from '@/api/auth.api';
import AppTabBar from '@/components/AppTabBar/AppTabBar.vue';
import { isTabBarPath } from '@/constants/tabbar';
import { useTabBarPage } from '@/composables/useTabBarPage';
import { useUserStore } from '@/stores/user';

useTabBarPage();

const userStore = useUserStore();
const appVersion = 'v1.0.0';

function onHeaderClick() {
  if (userStore.isLoggedIn) {
    uni.navigateTo({ url: '/pages/mine/profile' });
  } else {
    uni.navigateTo({ url: '/pages/auth/login' });
  }
}

function goPage(url: string) {
  if (isTabBarPath(url)) {
    uni.switchTab({ url: url.startsWith('/') ? url : `/${url}` });
    return;
  }
  if (!userStore.isLoggedIn && !url.includes('/pages/mine/profile')) {
    uni.navigateTo({ url: '/pages/auth/login' });
    return;
  }
  uni.navigateTo({ url });
}

async function onLogout() {
  await postLogout();
  userStore.logout();
  uni.showToast({ title: '已退出', icon: 'success' });
}
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.page-mine__header {
  position: relative;
  overflow: hidden;
  padding: 56rpx $cv-space-page 64rpx;
  padding-top: calc(44rpx + env(safe-area-inset-top));
  @include cv-hero-bg;
}

.page-mine__glow {
  @include cv-hero-orb(320rpx, -50rpx, -70rpx);
}

.page-mine__header-inner {
  position: relative;
  display: flex;
  align-items: center;
  gap: 24rpx;
  z-index: 1;
}

.page-mine__avatar-wrap {
  padding: 4rpx;
  border-radius: 50%;
  border: 2rpx solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 12rpx 32rpx rgba(0, 0, 0, 0.15);
}

.page-mine__info {
  flex: 1;
}

.page-mine__name {
  display: block;
  font-size: 44rpx;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.05em;
}

.page-mine__tip {
  display: block;
  margin-top: 10rpx;
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.82);
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
}

.page-mine__body {
  @include cv-body-sheet;
  margin-top: -44rpx;
}

.page-mine__stats {
  display: flex;
  align-items: stretch;
  padding: 36rpx 16rpx;
}

.page-mine__stat {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10rpx;
  @include cv-pressable;
}

.page-mine__stat-num {
  font-size: 32rpx;
  font-weight: 700;
  color: $cv-text;
  letter-spacing: -0.02em;
}

.page-mine__stat-label {
  font-size: 22rpx;
  color: $cv-text-muted;
}

.page-mine__stat-divider {
  width: 1rpx;
  background: $cv-border-strong;
  margin: 12rpx 0;
}

.page-mine__menu {
  margin-top: 32rpx;
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
}
</style>
