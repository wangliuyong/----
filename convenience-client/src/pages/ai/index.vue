<template>
  <view class="page-ai">
    <!-- 顶部：深色编辑感头部，非浮动卡片 -->
    <view class="page-ai__header">
      <view class="page-ai__header-glow" />
      <view class="page-ai__header-row">
        <view class="page-ai__back" @click="goBack">
          <u-icon name="arrow-left" color="rgba(255,255,255,0.92)" size="18" />
        </view>
        <view class="page-ai__brand">
          <view class="page-ai__avatar">
            <u-icon name="chat-fill" color="#fff" size="22" />
          </view>
          <view class="page-ai__brand-text">
            <text class="page-ai__title">便民 AI</text>
            <text class="page-ai__desc">办事指南 · 发布流程 · 常见问题</text>
          </view>
        </view>
        <view class="page-ai__history-btn" @click="goHistory">
          <u-icon name="clock" color="rgba(255,255,255,0.9)" size="16" />
          <text>历史</text>
        </view>
      </view>
    </view>

    <!-- 消息区：flex:1 + height:0 保证各端 scroll-view 可滚动 -->
    <scroll-view class="page-ai__messages" scroll-y :scroll-top="scrollTop" scroll-with-animation
      :show-scrollbar="false">
      <!-- 空态欢迎 -->
      <view v-if="!messages.length && !streaming" class="page-ai__welcome">
        <view class="page-ai__welcome-icon">
          <u-icon name="chat" color="#1d4ed8" size="36" />
        </view>
        <text class="page-ai__welcome-title">有什么可以帮你？</text>
        <text class="page-ai__welcome-sub">选择快捷问题，或直接输入</text>
        <view class="page-ai__chips">
          <view v-for="chip in quickChips" :key="chip" class="page-ai__chip" @click="useChip(chip)">
            <text>{{ chip }}</text>
            <u-icon name="arrow-right" color="#1d4ed8" size="12" />
          </view>
        </view>
      </view>

      <view class="page-ai__msg-list">
        <AiMessageBubble v-for="msg in messages" :key="msg.id" :role="msg.role" :content="msg.content" />
      </view>

      <view v-if="streaming" class="page-ai__typing">
        <u-loading-icon mode="circle" size="16" color="#1d4ed8" />
        <text>正在整理回答</text>
      </view>

      <!-- 底部占位，避免最后一条被输入栏遮挡 -->
      <view class="page-ai__scroll-pad" />
    </scroll-view>

    <!-- 输入区：沉浸式贴底（本页隐藏 TabBar） -->
    <view class="page-ai__composer">
      <view class="page-ai__input-wrap">
        <u-input v-model="question" placeholder="输入您的问题" border="none" :custom-style="inputStyle" confirm-type="send"
          @confirm="onSend" />
      </view>
      <view class="page-ai__send" :class="{ 'page-ai__send--disabled': streaming || !question.trim() }" @click="onSend">
        <u-icon name="arrow-up" color="#fff" size="18" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue';
import { onLoad, onShow } from '@dcloudio/uni-app';
import { queryAiMessages, streamAiChat } from '@/api/ai.api';
import AiMessageBubble from '@/components/AiMessageBubble/AiMessageBubble.vue';
import { TAB_BAR_ITEMS } from '@/constants/tabbar';
import { useTabBarPage } from '@/composables/useTabBarPage';
import { useAiStore } from '@/stores/ai';
import { useUserStore } from '@/stores/user';
import type { AiMessageItem } from '@/types/city-info';

useTabBarPage();

const aiStore = useAiStore();
const userStore = useUserStore();
const question = ref('');
const messages = ref<AiMessageItem[]>([]);
const sessionId = ref<number>();
const streaming = ref(false);
const scrollTop = ref(0);
let msgId = 1;

const quickChips = ['如何发布信息？', '审核要多久？', '怎么举报违规？'];

/** u-input 内联样式，避免与外层 flex 冲突 */
const inputStyle = {
  background: 'transparent',
  fontSize: '28rpx',
  padding: '0',
};

function goHistory() {
  if (!userStore.isLoggedIn) {
    uni.navigateTo({ url: '/pages/auth/login' });
    return;
  }
  uni.navigateTo({ url: '/pages/ai/history' });
}

/**
 * 离开 AI 聊天
 * AI 为 Tab 页，switchTab 进入时栈内无上一页，navigateBack 只会刷新当前页
 * 仅当上一页是次级页（如历史会话）时才 navigateBack，否则 switchTab 回首页
 */
function goBack() {
  const pages = getCurrentPages();
  if (pages.length > 1) {
    const prevRoute = pages[pages.length - 2]?.route ?? '';
    const prevIsTab = TAB_BAR_ITEMS.some((item) => item.pagePath === prevRoute);
    if (!prevIsTab) {
      uni.navigateBack();
      return;
    }
  }
  uni.switchTab({ url: '/pages/home/index' });
}

function useChip(text: string) {
  question.value = text;
  onSend();
}

async function scrollToBottom() {
  await nextTick();
  scrollTop.value = scrollTop.value === 99999 ? 100000 : 99999;
}

async function onSend() {
  const text = question.value.trim();
  if (!text || streaming.value) return;

  if (!userStore.isLoggedIn) {
    uni.navigateTo({ url: '/pages/auth/login' });
    return;
  }

  question.value = '';
  const userMsg: AiMessageItem = {
    id: msgId++,
    sessionId: sessionId.value || 0,
    role: 'user',
    content: text,
    createdAt: new Date().toISOString(),
  };
  messages.value.push(userMsg);
  await scrollToBottom();

  const assistantMsg: AiMessageItem = {
    id: msgId++,
    sessionId: sessionId.value || 0,
    role: 'assistant',
    content: '',
    createdAt: new Date().toISOString(),
  };
  messages.value.push(assistantMsg);
  streaming.value = true;

  try {
    const gen = streamAiChat({ sessionId: sessionId.value, question: text });
    let step = await gen.next();
    while (!step.done) {
      assistantMsg.content += step.value;
      await scrollToBottom();
      step = await gen.next();
    }
    if (step.value?.sessionId) {
      sessionId.value = step.value.sessionId;
    }
  } catch (e) {
    assistantMsg.content = (e as Error).message || '回答失败，请重试';
  } finally {
    streaming.value = false;
    await scrollToBottom();
  }
}

async function loadSessionHistory(id: number) {
  sessionId.value = id;
  streaming.value = false;
  question.value = '';
  const history = await queryAiMessages(id);
  messages.value = history;
  msgId = history.length + 1;
  await scrollToBottom();
}

onLoad((query) => {
  if (query?.sessionId) {
    sessionId.value = Number(query.sessionId);
  }
});

onShow(async () => {
  const pendingId = aiStore.consumePendingSessionId();
  if (pendingId) {
    await loadSessionHistory(pendingId);
  }
});

onMounted(async () => {
  if (!sessionId.value || messages.value.length) return;
  await loadSessionHistory(sessionId.value);
});
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

/**
 * 聊天页布局：header + scroll + 贴底输入栏（进入本页隐藏 TabBar）
 */
.page-ai {
  display: flex;
  flex-direction: column;
  height: 100vh;
  box-sizing: border-box;
  background: $cv-bg;
  overflow: hidden;
}

/** 输入栏高度 + safe-area，供消息区留白 */
$ai-composer-offset: calc(112rpx + env(safe-area-inset-bottom));

.page-ai__header {
  position: relative;
  flex-shrink: 0;
  overflow: hidden;
  @include cv-hero-bg;
  padding: 20rpx $cv-space-page 28rpx;
  padding-top: calc(20rpx + env(safe-area-inset-top));
}

.page-ai__header-glow {
  @include cv-hero-orb(260rpx, -50rpx, -40rpx);
}

.page-ai__header-row {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
}

.page-ai__back {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 1rpx solid rgba(255, 255, 255, 0.16);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  @include cv-pressable;
}

.page-ai__brand {
  display: flex;
  align-items: center;
  gap: 18rpx;
  flex: 1;
  min-width: 0;
}

.page-ai__avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 24rpx;
  background: rgba(255, 255, 255, 0.14);
  border: 1rpx solid rgba(255, 255, 255, 0.22);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: inset 0 1rpx 0 rgba(255, 255, 255, 0.3);
}

.page-ai__title {
  display: block;
  font-size: 36rpx;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.04em;
}

.page-ai__desc {
  display: block;
  margin-top: 4rpx;
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.75);
  letter-spacing: 0.02em;
}

.page-ai__history-btn {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 14rpx 22rpx;
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.92);
  background: rgba(255, 255, 255, 0.12);
  border: 1rpx solid rgba(255, 255, 255, 0.2);
  border-radius: $cv-radius-pill;
  flex-shrink: 0;
  @include cv-pressable;
}

.page-ai__messages {
  @include cv-chat-scroll;
  padding: 0 24rpx;
  padding-bottom: $ai-composer-offset;
}

.page-ai__msg-list {
  padding-top: 24rpx;
}

.page-ai__scroll-pad {
  height: 16rpx;
}

.page-ai__welcome {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80rpx 20rpx 40rpx;
  text-align: center;
}

.page-ai__welcome-icon {
  width: 120rpx;
  height: 120rpx;
  border-radius: 36rpx;
  background: $cv-surface;
  border: 1rpx solid $cv-border;
  box-shadow: $cv-shadow-soft;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32rpx;
}

.page-ai__welcome-title {
  display: block;
  font-size: 40rpx;
  font-weight: 700;
  color: $cv-text;
  letter-spacing: -0.05em;
}

.page-ai__welcome-sub {
  display: block;
  margin-top: 12rpx;
  font-size: 26rpx;
  color: $cv-text-secondary;
}

.page-ai__chips {
  width: 100%;
  margin-top: 40rpx;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.page-ai__chip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28rpx 32rpx;
  background: $cv-surface;
  border: 1rpx solid $cv-border;
  border-radius: $cv-radius-card;
  box-shadow: $cv-shadow-soft;
  font-size: 28rpx;
  color: $cv-text;
  font-weight: 500;
  @include cv-pressable;
}

.page-ai__typing {
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 8rpx 0 16rpx;
  color: $cv-text-muted;
  font-size: 24rpx;
}

.page-ai__composer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 16rpx $cv-space-page calc(16rpx + env(safe-area-inset-bottom));
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(28px);
  -webkit-backdrop-filter: blur(28px);
  border-top: 1rpx solid $cv-border;
  box-shadow: 0 -8rpx 32rpx rgba(11, 18, 32, 0.04);
}

.page-ai__input-wrap {
  flex: 1;
  min-width: 0;
  padding: 18rpx 28rpx;
  background: $cv-surface-muted;
  border-radius: $cv-radius-pill;
  border: 1rpx solid $cv-border;
}

.page-ai__send {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: linear-gradient(145deg, $cv-primary-dark, $cv-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 12rpx 28rpx rgba(29, 78, 216, 0.28);
  @include cv-pressable;

  &--disabled {
    opacity: 0.45;
    pointer-events: none;
  }
}
</style>
