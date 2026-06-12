<template>
  <view class="page-login">
    <!-- 顶部英雄区 -->
    <view class="page-login__hero">
      <view class="page-login__orb page-login__orb--1" />
      <view class="page-login__orb page-login__orb--2" />
      <view class="page-login__nav">
        <view class="page-login__back" hover-class="page-login__back--pressed" @click="onBack">
          <u-icon name="arrow-left" color="#fff" size="18" />
        </view>
      </view>
      <text class="page-login__title">同城便民</text>
      <text class="page-login__subtitle">连接本地生活与服务，发布、收藏、问答一站完成</text>

      <!-- 平台数据概览 -->
      <view class="page-login__stats">
        <view class="page-login__stat">
          <text class="page-login__stat-val">14</text>
          <text class="page-login__stat-label">大类</text>
        </view>
        <view class="page-login__stat">
          <text class="page-login__stat-val">80+</text>
          <text class="page-login__stat-label">子类</text>
        </view>
        <view class="page-login__stat">
          <text class="page-login__stat-val">50+</text>
          <text class="page-login__stat-label">同城信息</text>
        </view>
      </view>
    </view>

    <scroll-view scroll-y class="page-login__scroll" :show-scrollbar="false">
      <view class="page-login__body">
        <!-- 登录后可用的能力 -->
        <view class="page-login__features">
          <view v-for="item in featureList" :key="item.key" class="page-login__feature cv-card">
            <view class="page-login__feature-icon" :class="`page-login__feature-icon--${item.tone}`">
              <u-icon :name="item.icon" color="#fff" size="20" />
            </view>
            <view class="page-login__feature-text">
              <text class="page-login__feature-title">{{ item.title }}</text>
              <text class="page-login__feature-desc">{{ item.desc }}</text>
            </view>
          </view>
        </view>

        <!-- #ifdef MP-WEIXIN -->
        <view class="page-login__panel cv-card--elevated">
          <text class="page-login__panel-title">微信快捷登录</text>
          <text class="page-login__panel-desc">授权后可直接发布、收藏与 AI 问答</text>
          <view
            class="page-login__submit"
            :class="{ 'page-login__submit--loading': loading }"
            hover-class="page-login__submit--pressed"
            @click="onWechatLogin"
          >
            <u-icon name="weixin-fill" color="#fff" size="20" />
            <text>{{ loading ? '登录中...' : '微信一键登录' }}</text>
          </view>
        </view>
        <!-- #endif -->

        <!-- #ifndef MP-WEIXIN -->
        <view class="page-login__panel cv-card--elevated">
          <text class="page-login__panel-title">手机号登录</text>
          <text class="page-login__panel-desc">登录后同步收藏与发布记录</text>

          <view class="page-login__field">
            <text class="page-login__label">手机号</text>
            <u-input
              v-model="form.phone"
              placeholder="请输入手机号"
              type="number"
              maxlength="11"
              border="surround"
              shape="circle"
            />
          </view>
          <view class="page-login__field">
            <text class="page-login__label">密码</text>
            <u-input
              v-model="form.password"
              placeholder="请输入密码"
              password
              border="surround"
              shape="circle"
            />
          </view>

          <view
            class="page-login__submit"
            :class="{ 'page-login__submit--loading': loading }"
            hover-class="page-login__submit--pressed"
            @click="onPhoneLogin"
          >
            <text>{{ loading ? '登录中...' : '登录' }}</text>
          </view>
          <text class="page-login__hint">Mock 账号：13800138000 / 123456</text>
        </view>
        <!-- #endif -->

        <!-- 隐私说明 -->
        <view class="page-login__trust">
          <u-icon name="lock-fill" color="#64748b" size="14" />
          <text class="page-login__trust-text">我们仅用于身份识别，不会向第三方出售您的个人信息</text>
        </view>
      </view>
    </scroll-view>

    <AiAssistantFab />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AiAssistantFab from '@/components/AiAssistantFab/AiAssistantFab.vue';
import { postPhoneLogin, postWechatLogin } from '@/api/auth.api';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const loading = ref(false);
const form = ref({ phone: '13800138000', password: '123456' });

/** 登录后可用的核心能力 */
const featureList = [
  {
    key: 'publish',
    title: '发布便民信息',
    desc: '二手、招聘、上门服务等 14 大类',
    icon: 'plus-circle-fill',
    tone: 'blue',
  },
  {
    key: 'collect',
    title: '收藏与回看',
    desc: '感兴趣的信息随时找到',
    icon: 'star-fill',
    tone: 'ink',
  },
  {
    key: 'ai',
    title: 'AI 办事指南',
    desc: '平台规则与发布流程一问即答',
    icon: 'chat-fill',
    tone: 'teal',
  },
];

function onBack() {
  uni.navigateBack({ fail: () => uni.switchTab({ url: '/pages/mine/index' }) });
}

/** 登录成功后跳转首页 Tab */
function onLoginSuccess() {
  uni.showToast({ title: '登录成功', icon: 'success' });
  setTimeout(() => {
    uni.switchTab({ url: '/pages/home/index' });
  }, 500);
}

async function onWechatLogin() {
  loading.value = true;
  try {
    const loginRes = await new Promise<UniApp.LoginRes>((resolve, reject) => {
      uni.login({ provider: 'weixin', success: resolve, fail: reject });
    });
    const result = await postWechatLogin({ code: loginRes.code });
    userStore.setLogin(result.accessToken, result.user);
    onLoginSuccess();
  } catch (e) {
    uni.showToast({ title: (e as Error).message || '登录失败', icon: 'none' });
  } finally {
    loading.value = false;
  }
}

async function onPhoneLogin() {
  if (!form.value.phone || !form.value.password) {
    uni.showToast({ title: '请输入手机号和密码', icon: 'none' });
    return;
  }
  loading.value = true;
  try {
    const result = await postPhoneLogin({
      phone: form.value.phone,
      password: form.value.password,
    });
    userStore.setLogin(result.accessToken, result.user);
    onLoginSuccess();
  } catch (e) {
    uni.showToast({ title: (e as Error).message || '登录失败', icon: 'none' });
  } finally {
    loading.value = false;
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.page-login {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: $cv-bg;
  overflow: hidden;
}

.page-login__hero {
  position: relative;
  flex-shrink: 0;
  overflow: hidden;
  @include cv-hero-bg;
  padding: 20rpx $cv-space-page 32rpx;
  padding-top: calc(20rpx + env(safe-area-inset-top));
}

.page-login__orb {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  border: 1rpx solid rgba(255, 255, 255, 0.14);
  pointer-events: none;
}

.page-login__orb--1 {
  width: 240rpx;
  height: 240rpx;
  right: -50rpx;
  top: 10rpx;
}

.page-login__orb--2 {
  width: 140rpx;
  height: 140rpx;
  left: -30rpx;
  bottom: 20rpx;
}

.page-login__nav {
  position: relative;
  z-index: 1;
  margin-bottom: 24rpx;
}

.page-login__back {
  width: 64rpx;
  height: 64rpx;
  border-radius: 20rpx;
  background: rgba(255, 255, 255, 0.12);
  border: 1rpx solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-login__back--pressed {
  opacity: 0.85;
  transform: scale(0.96);
}

.page-login__title {
  position: relative;
  z-index: 1;
  display: block;
  font-size: 52rpx;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.05em;
  line-height: 1.15;
}

.page-login__subtitle {
  position: relative;
  z-index: 1;
  display: block;
  margin-top: 14rpx;
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.78);
  max-width: 560rpx;
  line-height: 1.55;
}

.page-login__stats {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12rpx;
  margin-top: 28rpx;
}

.page-login__stat {
  padding: 18rpx 12rpx;
  border-radius: 20rpx;
  background: rgba(255, 255, 255, 0.1);
  border: 1rpx solid rgba(255, 255, 255, 0.14);
  text-align: center;
}

.page-login__stat-val {
  display: block;
  font-size: 32rpx;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.03em;
}

.page-login__stat-label {
  display: block;
  margin-top: 4rpx;
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.68);
}

.page-login__scroll {
  flex: 1;
  height: 0;
  width: 100%;
}

.page-login__body {
  padding: 20rpx $cv-space-page calc(32rpx + env(safe-area-inset-bottom));
}

.page-login__features {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  margin-bottom: 20rpx;
}

.page-login__feature {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 24rpx 28rpx;
}

.page-login__feature-icon {
  width: 72rpx;
  height: 72rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &--blue {
    background: linear-gradient(145deg, $cv-primary-dark, $cv-primary);
  }

  &--ink {
    background: linear-gradient(145deg, $cv-hero-ink, $cv-primary-mid);
  }

  &--teal {
    background: linear-gradient(145deg, #0f766e, #14b8a6);
  }
}

.page-login__feature-text {
  flex: 1;
  min-width: 0;
}

.page-login__feature-title {
  display: block;
  font-size: 28rpx;
  font-weight: 700;
  color: $cv-text;
  letter-spacing: -0.03em;
}

.page-login__feature-desc {
  display: block;
  margin-top: 6rpx;
  font-size: 24rpx;
  color: $cv-text-secondary;
  line-height: 1.45;
}

.page-login__panel {
  padding: 40rpx 36rpx;
  margin-bottom: 20rpx;
}

.page-login__panel-title {
  display: block;
  font-size: 36rpx;
  font-weight: 700;
  color: $cv-text;
  letter-spacing: -0.04em;
}

.page-login__panel-desc {
  display: block;
  margin: 12rpx 0 28rpx;
  font-size: 26rpx;
  color: $cv-text-secondary;
  line-height: 1.5;
}

.page-login__field {
  margin-bottom: 24rpx;
}

.page-login__label {
  display: block;
  margin-bottom: 12rpx;
  font-size: 26rpx;
  font-weight: 600;
  color: $cv-text;
}

.page-login__submit {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  height: 88rpx;
  margin-top: 8rpx;
  border-radius: $cv-radius-pill;
  background: linear-gradient(155deg, $cv-hero-ink 0%, $cv-primary-dark 42%, $cv-primary 100%);
  color: #fff;
  font-size: 30rpx;
  font-weight: 600;
  box-shadow: 0 12rpx 32rpx rgba(29, 78, 216, 0.28);
  @include cv-pressable;

  &--loading {
    opacity: 0.72;
  }
}

.page-login__submit--pressed {
  opacity: 0.92;
  transform: scale(0.98);
}

.page-login__hint {
  display: block;
  margin-top: 24rpx;
  font-size: 24rpx;
  color: $cv-text-muted;
  text-align: center;
}

.page-login__trust {
  display: flex;
  align-items: flex-start;
  gap: 10rpx;
  padding: 20rpx 24rpx;
  border-radius: $cv-radius-card;
  background: $cv-surface-muted;
}

.page-login__trust-text {
  flex: 1;
  font-size: 22rpx;
  color: $cv-text-muted;
  line-height: 1.55;
}
</style>
