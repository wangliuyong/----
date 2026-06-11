<template>
  <view class="page-history">
    <view v-for="session in sessions" :key="session.id" class="page-history__item cv-card"
      @click="openSession(session.id)">
      <view class="page-history__icon">
        <u-icon name="chat-fill" color="#1d4ed8" size="18" />
      </view>
      <view class="page-history__content">
        <text class="page-history__title">{{ session.title }}</text>
        <text class="page-history__time">{{ formatRelativeTime(session.createdAt) }}</text>
      </view>
      <u-icon name="arrow-right" color="#cbd5e1" size="14" />
    </view>
    <u-empty v-if="!loading && !sessions.length" mode="message" text="暂无历史会话" />
    <AiAssistantFab />
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { queryAiSessions } from '@/api/ai.api';
import AiAssistantFab from '@/components/AiAssistantFab/AiAssistantFab.vue';
import { useAiStore } from '@/stores/ai';
import type { AiSessionItem } from '@/types/city-info';
import { formatRelativeTime } from '@/utils/format';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const aiStore = useAiStore();
const sessions = ref<AiSessionItem[]>([]);
const loading = ref(false);

function openSession(sessionId: number) {
  aiStore.openSessionTab(sessionId);
}

onMounted(async () => {
  if (!userStore.isLoggedIn) {
    uni.navigateTo({ url: '/pages/auth/login' });
    return;
  }
  loading.value = true;
  try {
    sessions.value = await queryAiSessions();
  } finally {
    loading.value = false;
  }
});
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.page-history {
  @include cv-subpage-body;
}

.page-history__item {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 32rpx 28rpx;
  margin-bottom: 18rpx;
  @include cv-pressable;
}

.page-history__icon {
  width: 72rpx;
  height: 72rpx;
  border-radius: 22rpx;
  background: $cv-primary-soft;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.page-history__content {
  flex: 1;
  min-width: 0;
}

.page-history__title {
  display: block;
  font-size: 30rpx;
  font-weight: 700;
  color: $cv-text;
  letter-spacing: -0.02em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.page-history__time {
  display: block;
  margin-top: 8rpx;
  font-size: 24rpx;
  color: $cv-text-muted;
}
</style>
