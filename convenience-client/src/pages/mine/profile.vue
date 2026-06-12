<template>
  <view class="page-profile">
    <!-- 顶部英雄区：当前账号概览 -->
    <view class="page-profile__hero">
      <view class="page-profile__hero-glow" />
      <view class="page-profile__nav">
        <view class="page-profile__back" hover-class="page-profile__back--pressed" @click="onBack">
          <u-icon name="arrow-left" color="#fff" size="18" />
        </view>
        <view class="page-profile__nav-text">
          <text class="page-profile__title">账号设置</text>
          <text class="page-profile__subtitle">管理昵称、头像与联系方式</text>
        </view>
      </view>

      <view class="page-profile__hero-user" @click="chooseAvatar">
        <view class="page-profile__avatar-ring">
          <u-avatar :src="form.avatar" size="80" />
          <view class="page-profile__avatar-edit">
            <u-icon name="camera-fill" color="#fff" size="14" />
          </view>
        </view>
        <view class="page-profile__hero-info">
          <text class="page-profile__hero-name">{{ form.nickname || '未设置昵称' }}</text>
          <text class="page-profile__hero-meta">{{ maskedPhone || '未绑定手机' }}</text>
          <text v-if="joinLabel" class="page-profile__hero-meta">{{ joinLabel }}</text>
        </view>
      </view>
    </view>

    <scroll-view scroll-y class="page-profile__scroll" :show-scrollbar="false">
      <view class="page-profile__body">
        <!-- 账号信息概览 -->
        <view class="page-profile__overview">
          <view class="page-profile__overview-item cv-card">
            <u-icon name="account-fill" color="#1d4ed8" size="18" />
            <text class="page-profile__overview-val">{{ userTypeLabel }}</text>
            <text class="page-profile__overview-label">账号类型</text>
          </view>
          <view class="page-profile__overview-item cv-card">
            <u-icon name="checkmark-circle" color="#16a34a" size="18" />
            <text class="page-profile__overview-val">{{ profileStatusLabel }}</text>
            <text class="page-profile__overview-label">账号状态</text>
          </view>
          <view class="page-profile__overview-item cv-card">
            <u-icon name="edit-pen-fill" color="#1d4ed8" size="18" />
            <text class="page-profile__overview-val">{{ completenessText }}</text>
            <text class="page-profile__overview-label">资料完成度</text>
          </view>
        </view>

        <!-- 基本资料 -->
        <view class="page-profile__section cv-card">
          <text class="page-profile__section-title">基本资料</text>
          <view class="page-profile__field">
            <text class="page-profile__label">昵称</text>
            <u-input
              v-model="form.nickname"
              placeholder="请输入昵称"
              maxlength="20"
              border="none"
              clearable
            />
            <text class="page-profile__hint">2-20 个字符，将在发布与评论中展示</text>
          </view>
          <view class="page-profile__divider" />
          <view class="page-profile__field">
            <text class="page-profile__label">手机号</text>
            <u-input
              v-model="form.phone"
              placeholder="请输入手机号"
              type="number"
              maxlength="11"
              border="none"
              clearable
            />
            <text class="page-profile__hint">用于登录与重要通知，不会公开展示</text>
          </view>
        </view>

        <!-- 头像说明 -->
        <view class="page-profile__section cv-card">
          <text class="page-profile__section-title">头像</text>
          <view class="page-profile__avatar-row" @click="chooseAvatar">
            <u-avatar :src="form.avatar" size="56" />
            <view class="page-profile__avatar-copy">
              <text class="page-profile__avatar-action">更换头像</text>
              <text class="page-profile__hint">支持相册选取，建议正方形图片</text>
            </view>
            <u-icon name="arrow-right" color="#cbd5e1" size="16" />
          </view>
        </view>

        <view class="page-profile__scroll-pad" />
      </view>
    </scroll-view>

    <!-- 底部保存栏 -->
    <view class="page-profile__bar">
      <view
        class="page-profile__save"
        :class="{ 'page-profile__save--loading': saving }"
        hover-class="page-profile__save--pressed"
        @click="onSave"
      >
        <text>{{ saving ? '保存中...' : '保存修改' }}</text>
      </view>
    </view>

    <AiAssistantFab />
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { postUploadImage } from '@/api/ai.api';
import { postUpdateProfile, queryProfile } from '@/api/auth.api';
import AiAssistantFab from '@/components/AiAssistantFab/AiAssistantFab.vue';
import { useUserStore } from '@/stores/user';
import type { UserProfile, UserType } from '@/types/user';
import { formatDateTime, formatPhoneMask } from '@/utils/format';

const userStore = useUserStore();
const saving = ref(false);
const form = ref({ nickname: '', phone: '', avatar: '' });
const profile = ref<UserProfile | null>(null);

/** 账号类型文案 */
const USER_TYPE_LABEL: Record<UserType, string> = {
  USER: '普通用户',
  MERCHANT: '商家',
  ADMIN: '管理员',
};

const maskedPhone = computed(() => formatPhoneMask(form.value.phone));

const joinLabel = computed(() => {
  const createdAt = profile.value?.createdAt;
  if (!createdAt) return '';
  return `${formatDateTime(createdAt, 'YYYY年M月')}注册`;
});

const userTypeLabel = computed(() => {
  if (!profile.value) return '-';
  return USER_TYPE_LABEL[profile.value.userType] || '普通用户';
});

const profileStatusLabel = computed(() => {
  if (!profile.value) return '-';
  return profile.value.status === 'ACTIVE' ? '正常' : '已停用';
});

/** 资料完成度：昵称、手机、头像三项 */
const completenessText = computed(() => {
  let score = 0;
  if (form.value.nickname.trim()) score += 1;
  if (form.value.phone?.length >= 11) score += 1;
  if (form.value.avatar) score += 1;
  return `${score}/3`;
});

function onBack() {
  uni.navigateBack({ fail: () => uni.switchTab({ url: '/pages/mine/index' }) });
}

/** 选择头像并上传 */
function chooseAvatar() {
  uni.chooseImage({
    count: 1,
    success: async (res) => {
      const path = res.tempFilePaths[0];
      try {
        const uploaded = await postUploadImage(path);
        form.value.avatar = uploaded.url;
      } catch (e) {
        uni.showToast({ title: (e as Error).message, icon: 'none' });
      }
    },
  });
}

/** 保存资料 */
async function onSave() {
  if (!userStore.isLoggedIn) {
    uni.navigateTo({ url: '/pages/auth/login' });
    return;
  }
  if (!form.value.nickname.trim()) {
    uni.showToast({ title: '请输入昵称', icon: 'none' });
    return;
  }
  saving.value = true;
  try {
    const updated = await postUpdateProfile({
      nickname: form.value.nickname.trim(),
      phone: form.value.phone || undefined,
      avatar: form.value.avatar || undefined,
    });
    userStore.updateProfile(updated);
    profile.value = updated;
    uni.showToast({ title: '保存成功', icon: 'success' });
  } catch (e) {
    uni.showToast({ title: (e as Error).message, icon: 'none' });
  } finally {
    saving.value = false;
  }
}

onMounted(async () => {
  if (!userStore.isLoggedIn) {
    uni.navigateTo({ url: '/pages/auth/login' });
    return;
  }
  const data = userStore.profile || (await queryProfile());
  profile.value = data;
  form.value = {
    nickname: data.nickname,
    phone: data.phone || '',
    avatar: data.avatar || '',
  };
});
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.page-profile {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: $cv-bg;
  overflow: hidden;
}

.page-profile__hero {
  position: relative;
  flex-shrink: 0;
  overflow: hidden;
  @include cv-hero-bg;
  padding: 20rpx $cv-space-page 28rpx;
  padding-top: calc(20rpx + env(safe-area-inset-top));
}

.page-profile__hero-glow {
  @include cv-hero-orb(200rpx, -30rpx, -20rpx);
}

.page-profile__nav {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-start;
  gap: 16rpx;
  margin-bottom: 28rpx;
}

.page-profile__back {
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

.page-profile__back--pressed {
  opacity: 0.85;
  transform: scale(0.96);
}

.page-profile__nav-text {
  flex: 1;
  min-width: 0;
  padding-top: 4rpx;
}

.page-profile__title {
  display: block;
  font-size: 40rpx;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.04em;
  line-height: 1.2;
}

.page-profile__subtitle {
  display: block;
  margin-top: 8rpx;
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.72);
}

.page-profile__hero-user {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.page-profile__avatar-ring {
  position: relative;
  padding: 6rpx;
  border-radius: 50%;
  border: 2rpx solid rgba(255, 255, 255, 0.35);
  box-shadow: 0 12rpx 32rpx rgba(11, 18, 32, 0.2);
}

.page-profile__avatar-edit {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 44rpx;
  height: 44rpx;
  border-radius: 50%;
  background: $cv-primary;
  border: 3rpx solid $cv-hero-ink;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-profile__hero-info {
  flex: 1;
  min-width: 0;
}

.page-profile__hero-name {
  display: block;
  font-size: 36rpx;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.03em;
  line-height: 1.25;
}

.page-profile__hero-meta {
  display: block;
  margin-top: 8rpx;
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.72);
  line-height: 1.4;
}

.page-profile__scroll {
  flex: 1;
  height: 0;
  width: 100%;
}

.page-profile__body {
  padding: 20rpx $cv-space-page 0;
}

.page-profile__overview {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12rpx;
  margin-bottom: 20rpx;
}

.page-profile__overview-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8rpx;
  padding: 22rpx 20rpx;
}

.page-profile__overview-val {
  font-size: 28rpx;
  font-weight: 700;
  color: $cv-text;
  letter-spacing: -0.02em;
}

.page-profile__overview-label {
  font-size: 22rpx;
  color: $cv-text-muted;
}

.page-profile__section {
  padding: 28rpx 32rpx;
  margin-bottom: 20rpx;
}

.page-profile__section-title {
  display: block;
  margin-bottom: 24rpx;
  @include cv-section-title;
}

.page-profile__field {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.page-profile__label {
  font-size: 26rpx;
  font-weight: 600;
  color: $cv-text;
}

.page-profile__hint {
  font-size: 22rpx;
  color: $cv-text-muted;
  line-height: 1.45;
}

.page-profile__divider {
  height: 1rpx;
  background: $cv-border;
  margin: 28rpx 0;
}

.page-profile__avatar-row {
  display: flex;
  align-items: center;
  gap: 20rpx;
  @include cv-pressable;
}

.page-profile__avatar-copy {
  flex: 1;
  min-width: 0;
}

.page-profile__avatar-action {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  color: $cv-primary;
}

.page-profile__scroll-pad {
  height: calc(140rpx + env(safe-area-inset-bottom));
}

.page-profile__bar {
  @include cv-bottom-bar;
}

.page-profile__save {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 88rpx;
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

.page-profile__save--pressed {
  opacity: 0.92;
  transform: scale(0.98);
}
</style>
