<template>
  <view class="ai-content">
    <!-- 空内容且正在生成：三点跳动 -->
    <view v-if="streaming && !content.trim()" class="ai-content__typing">
      <view v-for="i in 3" :key="i" class="ai-content__dot" :style="{ animationDelay: `${(i - 1) * 0.15}s` }" />
    </view>

    <template v-else>
      <template v-for="(block, index) in blocks" :key="index">
        <!-- 知识库/来源标签 -->
        <view v-if="block.type === 'tag'" class="ai-content__tag">
          <u-icon name="bookmark-fill" color="#1d4ed8" size="12" />
          <text>{{ block.text.replace(/^【|】$/g, '') }}</text>
        </view>

        <!-- 普通段落 -->
        <text v-else-if="block.type === 'paragraph'" class="ai-content__para">{{ block.text }}</text>

        <!-- 步骤/要点列表 -->
        <view v-else-if="block.type === 'list'" class="ai-content__list">
          <view v-for="(item, idx) in block.items" :key="idx" class="ai-content__list-item">
            <view class="ai-content__list-marker">
              <text v-if="block.ordered">{{ idx + 1 }}</text>
              <view v-else class="ai-content__list-dot" />
            </view>
            <text class="ai-content__list-text">{{ item }}</text>
          </view>
        </view>
      </template>

      <!-- 流式输出光标 -->
      <view v-if="streaming && content.trim()" class="ai-content__cursor" />
    </template>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { parseAiMessageContentSafe } from '@/utils/ai-message-format';

const props = defineProps<{
  content: string;
  /** 是否正在流式输出 */
  streaming?: boolean;
}>();

/** 解析后的内容块 */
const blocks = computed(() => parseAiMessageContentSafe(props.content));
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';

.ai-content {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  width: 100%;
}

.ai-content__tag {
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  gap: 8rpx;
  padding: 8rpx 16rpx;
  border-radius: 12rpx;
  background: $cv-primary-soft;
  font-size: 22rpx;
  font-weight: 600;
  color: $cv-primary-dark;
  letter-spacing: 0.02em;
}

.ai-content__para {
  display: block;
  font-size: 28rpx;
  line-height: 1.75;
  color: $cv-text;
  letter-spacing: -0.01em;
  white-space: pre-wrap;
  word-break: break-word;
}

.ai-content__list {
  display: flex;
  flex-direction: column;
  gap: 14rpx;
}

.ai-content__list-item {
  display: flex;
  align-items: flex-start;
  gap: 14rpx;
}

.ai-content__list-marker {
  width: 36rpx;
  height: 36rpx;
  border-radius: 10rpx;
  background: $cv-primary-soft;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 4rpx;

  text {
    font-size: 22rpx;
    font-weight: 700;
    color: $cv-primary;
    line-height: 1;
  }
}

.ai-content__list-dot {
  width: 10rpx;
  height: 10rpx;
  border-radius: 50%;
  background: $cv-primary;
}

.ai-content__list-text {
  flex: 1;
  min-width: 0;
  font-size: 28rpx;
  line-height: 1.72;
  color: $cv-text;
  word-break: break-word;
}

/** 等待首字时的三点动画 */
.ai-content__typing {
  display: flex;
  align-items: center;
  gap: 10rpx;
  padding: 8rpx 0;
}

.ai-content__dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background: $cv-primary;
  opacity: 0.35;
  animation: ai-dot-bounce 1s ease-in-out infinite;
}

@keyframes ai-dot-bounce {
  0%,
  80%,
  100% {
    transform: translateY(0);
    opacity: 0.35;
  }
  40% {
    transform: translateY(-8rpx);
    opacity: 1;
  }
}

/** 打字光标 */
.ai-content__cursor {
  display: inline-block;
  width: 4rpx;
  height: 28rpx;
  margin-top: 4rpx;
  background: $cv-primary;
  border-radius: 2rpx;
  animation: ai-cursor-blink 1s step-end infinite;
}

@keyframes ai-cursor-blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}
</style>
