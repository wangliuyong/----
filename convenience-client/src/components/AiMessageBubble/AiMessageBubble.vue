<template>
  <view class="msg" :class="role === 'user' ? 'msg--user' : 'msg--assistant'">
    <!-- 助手头像 -->
    <view v-if="role === 'assistant'" class="msg__avatar msg__avatar--ai">
      <u-icon name="chat-fill" color="#1d4ed8" size="16" />
    </view>

    <view class="msg__bubble" :class="role === 'user' ? 'msg__bubble--user' : 'msg__bubble--assistant'">
      <text class="msg__text">{{ content || ' ' }}</text>
      <view v-if="!content && role === 'assistant'" class="msg__cursor" />
    </view>

    <!-- 用户头像占位 -->
    <view v-if="role === 'user'" class="msg__avatar msg__avatar--user">
      <u-icon name="account-fill" color="#fff" size="16" />
    </view>
  </view>
</template>

<script setup lang="ts">
import type { AiMessageRole } from '@/types/city-info';

defineProps<{
  role: AiMessageRole;
  content: string;
}>();
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.msg {
  display: flex;
  align-items: flex-end;
  gap: 14rpx;
  margin-bottom: 28rpx;
  width: 100%;
}

.msg--user {
  flex-direction: row-reverse;
}

.msg__avatar {
  width: 56rpx;
  height: 56rpx;
  border-radius: 18rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.msg__avatar--ai {
  background: $cv-primary-soft;
  border: 1rpx solid rgba(29, 78, 216, 0.12);
}

.msg__avatar--user {
  background: linear-gradient(145deg, $cv-primary-dark, $cv-primary);
  box-shadow: 0 8rpx 20rpx rgba(29, 78, 216, 0.2);
}

.msg__bubble {
  max-width: calc(100% - 140rpx);
  padding: 24rpx 28rpx;
  border-radius: 28rpx;
  line-height: 1.72;
  position: relative;
}

.msg__bubble--user {
  @include cv-ai-bubble-user;
}

.msg__bubble--assistant {
  @include cv-ai-bubble-assistant;
}

.msg__text {
  font-size: 28rpx;
  white-space: pre-wrap;
  word-break: break-word;
  letter-spacing: -0.01em;
}

/** 流式输出光标 */
.msg__cursor {
  display: inline-block;
  width: 4rpx;
  height: 28rpx;
  margin-left: 4rpx;
  background: $cv-primary;
  border-radius: 2rpx;
  animation: cv-blink 1s step-end infinite;
  vertical-align: middle;
}

@keyframes cv-blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}
</style>
