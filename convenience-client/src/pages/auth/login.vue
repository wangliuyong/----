<template>
  <view class="page-login">
    <u-navbar title="登录" :auto-back="true" bg-color="transparent" title-color="#fff" left-icon-color="#fff" />

    <view class="page-login__hero">
      <view class="page-login__orb page-login__orb--1" />
      <view class="page-login__orb page-login__orb--2" />
      <text class="page-login__title">同城便民</text>
      <text class="page-login__subtitle">连接本地生活与服务</text>
    </view>

    <!-- #ifdef MP-WEIXIN -->
    <view class="page-login__panel cv-card--elevated">
      <text class="page-login__panel-title">微信快捷登录</text>
      <text class="page-login__panel-desc">授权后可直接发布、收藏与 AI 问答</text>
      <u-button type="primary" text="微信一键登录" shape="circle" :loading="loading" @click="onWechatLogin" />
    </view>
    <!-- #endif -->

    <!-- #ifndef MP-WEIXIN -->
    <view class="page-login__panel cv-card--elevated">
      <text class="page-login__panel-title">手机号登录</text>
      <u-form :model="form" label-width="0">
        <u-form-item>
          <u-input v-model="form.phone" placeholder="手机号" type="number" maxlength="11" border="surround"
            shape="circle" />
        </u-form-item>
        <u-form-item>
          <u-input v-model="form.password" placeholder="密码" password border="surround" shape="circle" />
        </u-form-item>
      </u-form>
      <u-button type="primary" text="登录" shape="circle" :loading="loading" @click="onPhoneLogin" />
      <text class="page-login__hint">Mock：13800138000 / 123456</text>
    </view>
    <!-- #endif -->
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

function onLoginSuccess() {
  uni.showToast({ title: '登录成功', icon: 'success' });
  setTimeout(() => {
    uni.navigateBack({ fail: () => uni.switchTab({ url: '/pages/mine/index' }) });
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
  @include cv-hero-bg;
  min-height: 100vh;
}

.page-login__hero {
  position: relative;
  padding: 24rpx 40rpx 64rpx;
  overflow: hidden;
}

.page-login__orb {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  border: 1rpx solid rgba(255, 255, 255, 0.14);
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
  bottom: 0;
}

.page-login__title {
  position: relative;
  display: block;
  font-size: 56rpx;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.05em;
}

.page-login__subtitle {
  position: relative;
  display: block;
  margin-top: 14rpx;
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.78);
  max-width: 520rpx;
  line-height: 1.55;
}

.page-login__panel {
  margin: 0 $cv-space-page;
  padding: 48rpx 40rpx;
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
  margin: 12rpx 0 32rpx;
  font-size: 26rpx;
  color: $cv-text-secondary;
  line-height: 1.5;
}

.page-login__hint {
  display: block;
  margin-top: 24rpx;
  font-size: 24rpx;
  color: $cv-text-muted;
  text-align: center;
}
</style>
