<template>
  <view class="page-profile">
    <view class="page-profile__avatar cv-card" @click="chooseAvatar">
      <view class="page-profile__avatar-ring">
        <u-avatar :src="form.avatar" size="80" />
      </view>
      <text class="page-profile__avatar-tip">点击更换头像</text>
    </view>

    <view class="page-profile__form cv-form-panel">
      <u-form :model="form" label-width="160rpx">
        <u-form-item label="昵称">
          <u-input v-model="form.nickname" placeholder="请输入昵称" maxlength="20" />
        </u-form-item>
        <u-form-item label="手机号">
          <u-input v-model="form.phone" placeholder="请输入手机号" type="number" maxlength="11" />
        </u-form-item>
      </u-form>
    </view>

    <view class="page-profile__actions">
      <u-button type="primary" text="保存" shape="circle" :loading="saving" @click="onSave" />
    </view>
    <AiAssistantFab />
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { postUploadImage } from '@/api/ai.api';
import { postUpdateProfile, queryProfile } from '@/api/auth.api';
import AiAssistantFab from '@/components/AiAssistantFab/AiAssistantFab.vue';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const saving = ref(false);
const form = ref({ nickname: '', phone: '', avatar: '' });

/** 选择头像并 Mock 上传 */
function chooseAvatar() {
  uni.chooseImage({
    count: 1,
    success: async (res) => {
      const path = res.tempFilePaths[0];
      const uploaded = await postUploadImage(path);
      form.value.avatar = uploaded.url;
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
    const profile = await postUpdateProfile({
      nickname: form.value.nickname.trim(),
      phone: form.value.phone || undefined,
      avatar: form.value.avatar || undefined,
    });
    userStore.updateProfile(profile);
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
  const profile = userStore.profile || (await queryProfile());
  form.value = {
    nickname: profile.nickname,
    phone: profile.phone || '',
    avatar: profile.avatar || '',
  };
});
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.page-profile {
  @include cv-subpage-body;
}

.page-profile__avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 52rpx 0;
  margin-bottom: 8rpx;
}

.page-profile__avatar-ring {
  padding: 6rpx;
  border-radius: 50%;
  border: 2rpx solid $cv-border;
  box-shadow: $cv-shadow-soft;
}

.page-profile__avatar-tip {
  margin-top: 20rpx;
  font-size: 24rpx;
  color: $cv-text-muted;
}

.page-profile__form {
  margin: 0;
}

.page-profile__actions {
  margin-top: 48rpx;
  padding: 0 16rpx;
}
</style>
