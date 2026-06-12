<template>
  <view class="page-notice">
    <!-- 加载骨架：与公告详情同形 -->
    <view v-if="loading" class="page-notice__inner cv-card">
      <SkeletonLine variant="long" height="44rpx" :shimmer="true" />
      <SkeletonLine variant="short" width="200rpx" />
      <view class="page-notice__sk-divider" />
      <SkeletonLine variant="long" />
      <SkeletonLine variant="long" />
      <SkeletonLine variant="mid" />
      <SkeletonLine variant="long" />
      <SkeletonLine variant="mid" />
    </view>

    <view v-else-if="notice" class="page-notice__inner cv-card">
      <view class="cv-editorial-rule" />
      <text class="page-notice__title">{{ notice.title }}</text>
      <text class="page-notice__time">{{ formatDateTime(notice.createdAt) }}</text>
      <view class="page-notice__divider" />
      <text class="page-notice__content">{{ notice.content }}</text>
    </view>

    <AiAssistantFab />
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { queryNoticeDetail } from '@/api/notice.api';
import AiAssistantFab from '@/components/AiAssistantFab/AiAssistantFab.vue';
import SkeletonLine from '@/components/SkeletonLine/SkeletonLine.vue';
import type { NoticeItem } from '@/types/city-info';
import { formatDateTime } from '@/utils/format';

const notice = ref<NoticeItem>();
const loading = ref(true);
let noticeId = 0;

onLoad((query) => {
  noticeId = Number(query?.id || 0);
});

onMounted(async () => {
  if (!noticeId) {
    loading.value = false;
    return;
  }
  loading.value = true;
  try {
    notice.value = await queryNoticeDetail(noticeId);
  } finally {
    loading.value = false;
  }
});
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.page-notice {
  @include cv-subpage-body;
}

.page-notice__inner {
  padding: 40rpx 36rpx;
  display: flex;
  flex-direction: column;
  gap: 18rpx;
}

.page-notice__sk-divider {
  height: 1rpx;
  margin: 18rpx 0;
  background: $cv-border;
}

.page-notice__title {
  display: block;
  font-size: 44rpx;
  font-weight: 700;
  color: $cv-text;
  line-height: 1.3;
  letter-spacing: -0.05em;
}

.page-notice__time {
  display: block;
  margin-top: 18rpx;
  font-size: 24rpx;
  color: $cv-text-muted;
}

.page-notice__divider {
  height: 1rpx;
  margin: 36rpx 0;
  background: $cv-border;
}

.page-notice__content {
  display: block;
  font-size: 30rpx;
  color: $cv-text-secondary;
  line-height: 1.85;
  white-space: pre-wrap;
}
</style>
