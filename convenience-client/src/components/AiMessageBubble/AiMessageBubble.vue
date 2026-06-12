<template>
  <view class="msg" :class="role === 'user' ? 'msg--user' : 'msg--assistant'">
    <!-- 助手头像 -->
    <view v-if="role === 'assistant'" class="msg__avatar msg__avatar--ai">
      <u-icon name="chat-fill" color="#1d4ed8" size="16" />
    </view>

    <view class="msg__bubble" :class="role === 'user' ? 'msg__bubble--user' : 'msg__bubble--assistant'">
      <!-- 用户消息：纯文本 -->
      <text v-if="role === 'user'" class="msg__text msg__text--user">{{ content }}</text>

      <!-- 助手消息：结构化友好展示 -->
      <AiMessageContent
        v-else
        :content="content"
        :streaming="streaming"
      />
    </view>

    <!-- 用户头像 -->
    <view v-if="role === 'user'" class="msg__avatar msg__avatar--user">
      <u-icon name="account-fill" color="#fff" size="16" />
    </view>
  </view>
</template>

<script setup lang="ts">
import type { AiMessageRole } from '@/types/city-info';
import AiMessageContent from '@/components/AiMessageContent/AiMessageContent.vue';

defineProps<{
  role: AiMessageRole;
  content: string;
  /** 助手消息是否正在流式输出 */
  streaming?: boolean;
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
  position: relative;
}

.msg__bubble--user {
  @include cv-ai-bubble-user;
  padding: 22rpx 28rpx;
}

.msg__bubble--assistant {
  @include cv-ai-bubble-assistant;
  min-width: 120rpx;
}

.msg__text--user {
  font-size: 28rpx;
  line-height: 1.72;
  white-space: pre-wrap;
  word-break: break-word;
  letter-spacing: -0.01em;
}
</style>
