<template>
  <!-- 全局 AI 小助手悬浮入口：轻量半透明，AI 页内自动隐藏 -->
  <view
    v-if="visible"
    class="ai-fab"
    :class="{ 'ai-fab--above-tab': aboveTabBar }"
    hover-class="ai-fab--pressed"
    :hover-stay-time="80"
    @click="goAiPage"
  >
    <view class="ai-fab__glow" aria-hidden="true" />
    <view class="ai-fab__body">
      <u-icon name="chat-fill" color="#ffffff" size="14" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { AI_PAGE_PATH, TAB_BAR_ITEMS } from '@/constants/tabbar';

/** AI 聊天页路由，在此页不展示悬浮入口 */
const AI_PAGE_ROUTE = AI_PAGE_PATH;

const props = defineProps<{
  /** 是否让出底部 TabBar 高度，不传时根据当前路由自动判断 */
  aboveTabBar?: boolean;
}>();

/** 根据当前路由决定是否展示（AI 页内不重复入口） */
const visible = ref(true);

/** 当前页面栈顶路由 */
const currentRoute = ref('');

/** 同步可见性：读取页面栈顶路由 */
function syncRouteState() {
  const pages = getCurrentPages();
  currentRoute.value = pages[pages.length - 1]?.route ?? '';
  visible.value = currentRoute.value !== AI_PAGE_ROUTE;
}

/** 是否位于带 TabBar 的页面（AI 聊天页虽为 Tab 但会隐藏 TabBar） */
const hasTabBarOnPage = computed(() => {
  const route = currentRoute.value;
  if (!route) return false;
  if (route === AI_PAGE_ROUTE) return false;
  return TAB_BAR_ITEMS.some((item) => item.pagePath === route);
});

/** 最终是否让出 TabBar 高度：显式 prop 优先，否则自动推断 */
const aboveTabBar = computed(() => {
  if (props.aboveTabBar !== undefined) return props.aboveTabBar;
  return hasTabBarOnPage.value;
});

/** 跳转 AI Tab 页 */
function goAiPage() {
  if (currentRoute.value === AI_PAGE_ROUTE) return;
  uni.switchTab({ url: `/${AI_PAGE_PATH}` });
}

onShow(() => {
  syncRouteState();
});

syncRouteState();
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';

.ai-fab {
  position: fixed;
  right: 20rpx;
  bottom: calc(20rpx + env(safe-area-inset-bottom));
  z-index: 900;
  opacity: 0.58;
  transition: transform 0.28s $cv-ease-out, opacity 0.28s $cv-ease-out;

  &--above-tab {
    /* TabBar + 中间凸起发布按钮额外让位 */
    bottom: calc(#{$cv-tabbar-height} + 48rpx + env(safe-area-inset-bottom));
  }

  &--pressed {
    transform: scale(0.92);
    opacity: 0.88;
  }
}

.ai-fab__glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 80rpx;
  height: 80rpx;
  margin-top: -40rpx;
  margin-left: -40rpx;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(29, 78, 216, 0.16) 0%, rgba(29, 78, 216, 0) 70%);
  pointer-events: none;
  animation: ai-fab-breathe 3.6s $cv-ease-out infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
}

.ai-fab__body {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  background: linear-gradient(
    145deg,
    rgba(37, 99, 235, 0.62) 0%,
    rgba(30, 58, 138, 0.55) 100%
  );
  border: 1rpx solid rgba(255, 255, 255, 0.28);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow:
    inset 0 1rpx 0 rgba(255, 255, 255, 0.28),
    0 8rpx 24rpx rgba(29, 78, 216, 0.14);
}

@keyframes ai-fab-breathe {
  0%,
  100% {
    opacity: 0.45;
    transform: scale(1);
  }

  50% {
    opacity: 0.75;
    transform: scale(1.05);
  }
}
</style>
