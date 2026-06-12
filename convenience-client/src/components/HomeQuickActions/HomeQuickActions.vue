<template>
  <!-- 首页快捷入口：不对称 Bento，发布为主操作 -->
  <view class="home-quick">
    <view class="home-quick__publish" hover-class="home-quick__cell--pressed" @click="emit('publish')">
      <view class="home-quick__publish-glow" />
      <view class="home-quick__publish-icon">
        <u-icon name="plus" color="#fff" size="22" />
      </view>
      <text class="home-quick__publish-title">发布信息</text>
      <text class="home-quick__publish-sub">闲置、招聘、服务</text>
    </view>

    <view class="home-quick__side">
      <view class="home-quick__cell home-quick__cell--ai" hover-class="home-quick__cell--pressed" @click="emit('ai')">
        <u-icon name="chat-fill" color="#1d4ed8" size="18" />
        <text>AI 助手</text>
      </view>
      <view class="home-quick__cell" hover-class="home-quick__cell--pressed" @click="emit('category')">
        <u-icon name="grid-fill" color="#1d4ed8" size="18" />
        <text>全部分类</text>
      </view>
      <view class="home-quick__cell" hover-class="home-quick__cell--pressed" @click="emit('search')">
        <u-icon name="search" color="#1d4ed8" size="18" />
        <text>搜索信息</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  publish: [];
  ai: [];
  category: [];
  search: [];
}>();
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.home-quick {
  display: grid;
  grid-template-columns: 1.15fr 1fr;
  gap: 14rpx;
  margin-bottom: 20rpx;
}

.home-quick__publish {
  position: relative;
  grid-row: span 3;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-height: 280rpx;
  padding: 28rpx 26rpx;
  border-radius: $cv-radius-card;
  background: $cv-cat-1;
  overflow: hidden;
  box-shadow: 0 16rpx 44rpx rgba(29, 78, 216, 0.28);
  @include cv-pressable;
}

.home-quick__publish-glow {
  position: absolute;
  right: -30rpx;
  top: -30rpx;
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  border: 1rpx solid rgba(255, 255, 255, 0.14);
  pointer-events: none;
}

.home-quick__publish-icon {
  position: relative;
  z-index: 1;
  width: 56rpx;
  height: 56rpx;
  border-radius: 18rpx;
  background: rgba(255, 255, 255, 0.14);
  border: 1rpx solid rgba(255, 255, 255, 0.22);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 18rpx;
}

.home-quick__publish-title {
  position: relative;
  z-index: 1;
  font-size: 34rpx;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.04em;
}

.home-quick__publish-sub {
  position: relative;
  z-index: 1;
  margin-top: 8rpx;
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.72);
}

.home-quick__side {
  display: flex;
  flex-direction: column;
  gap: 14rpx;
}

.home-quick__cell {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12rpx;
  min-height: 84rpx;
  padding: 0 22rpx;
  border-radius: $cv-radius-sm;
  background: $cv-surface;
  border: 1rpx solid $cv-border;
  box-shadow: $cv-shadow-soft;
  font-size: 26rpx;
  font-weight: 600;
  color: $cv-text;
  @include cv-pressable;

  &--ai {
    background: linear-gradient(135deg, rgba(29, 78, 216, 0.06) 0%, rgba(29, 78, 216, 0.12) 100%);
    border-color: rgba(29, 78, 216, 0.12);
  }
}

.home-quick__cell--pressed {
  opacity: 0.88;
  transform: scale(0.98);
}
</style>
