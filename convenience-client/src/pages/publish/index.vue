<template>
  <view class="page-publish cv-page">
    <!-- 顶部英雄区：标题 + 填写进度 -->
    <view class="page-publish__hero">
      <view class="page-publish__hero-orb page-publish__hero-orb--1" />
      <view class="page-publish__hero-orb page-publish__hero-orb--2" />
      <view class="page-publish__nav">
        <view class="page-publish__back" hover-class="page-publish__back--pressed" @click="onBack">
          <u-icon name="arrow-left" color="#fff" size="18" />
        </view>
      </view>
      <text class="page-publish__title">发布便民信息</text>
      <text class="page-publish__desc">真实、清晰的信息更容易被同城用户看到</text>
      <view class="page-publish__progress">
        <view class="page-publish__progress-track">
          <view
            class="page-publish__progress-fill"
            :style="{ width: `${completionPercent}%` }"
          />
        </view>
        <text class="page-publish__progress-label">必填 {{ completionCount }}/3</text>
      </view>
    </view>

    <view class="page-publish__body">
      <!-- 加载骨架：与表单区块同形 -->
      <template v-if="pageLoading">
        <view v-for="i in 4" :key="i" class="page-publish__section cv-card page-publish__section--sk">
          <view class="page-publish__section-head">
            <SkeletonBlock width="48rpx" height="48rpx" radius="50%" :shimmer="true" />
            <view class="page-publish__section-meta">
              <SkeletonLine variant="short" width="160rpx" />
              <SkeletonLine variant="mid" width="280rpx" />
            </view>
          </view>
          <SkeletonBlock height="120rpx" radius="16rpx" :shimmer="true" />
          <SkeletonBlock v-if="i <= 2" height="200rpx" radius="16rpx" :shimmer="true" />
        </view>
      </template>

      <template v-else>
      <!-- 区块 1：分类 -->
      <view
        id="publish-field-category"
        class="page-publish__section cv-card"
        :class="{ 'page-publish__section--error': errors.categoryId }"
      >
        <view class="page-publish__section-head">
          <view
            class="page-publish__section-badge"
            :class="{ 'page-publish__section-badge--error': errors.categoryId }"
          >
            1
          </view>
          <view class="page-publish__section-meta">
            <text
              class="page-publish__section-title"
              :class="{ 'page-publish__section-title--error': errors.categoryId }"
            >
              选择分类<text class="page-publish__required">*</text>
            </text>
            <text class="page-publish__section-sub">先选大类，再点具体类型</text>
          </view>
          <text v-if="errors.categoryId" class="page-publish__section-tip page-publish__section-tip--warn">
            请选择
          </text>
        </view>

        <!-- 一级分类：静态换行，不参与滚动 -->
        <CategoryRootStrip
          :list="categories"
          :active-id="activeRootId"
          layout="wrap"
          :show-hint="false"
          :class="{ 'page-publish__category-strip--error': errors.categoryId }"
          @select="onSelectRootItem"
        />

        <!-- 二级分类：本页唯一横向滚动区 -->
        <scroll-view
          v-if="activeChildren.length"
          scroll-x
          enable-flex
          class="page-publish__chips-scroll"
          :show-scrollbar="false"
        >
          <view class="page-publish__chips">
            <view
              v-for="child in activeChildren"
              :key="child.id"
              class="page-publish__chip"
              :class="{ 'page-publish__chip--active': form.categoryId === child.id }"
              @click="onSelectCategory(child.id)"
            >
              {{ child.name }}
            </view>
          </view>
        </scroll-view>

        <text v-if="errors.categoryId" class="page-publish__field-error page-publish__field-error--block">
          请选择具体分类后再提交
        </text>

        <view v-if="categoryLabel" class="page-publish__picked">
          <view class="page-publish__picked-icon">
            <u-icon name="checkmark-circle-fill" color="#1d4ed8" size="16" />
          </view>
          <view class="page-publish__picked-text">
            <text class="page-publish__picked-label">已选分类</text>
            <text class="page-publish__picked-value">{{ categoryLabel }}</text>
          </view>
        </view>
      </view>

      <!-- 区块 2：标题与详情 -->
      <view
        id="publish-field-title"
        class="page-publish__section cv-card"
        :class="{ 'page-publish__section--error': errors.title || errors.content }"
      >
        <view class="page-publish__section-head">
          <view class="page-publish__section-badge">2</view>
          <view class="page-publish__section-meta">
            <text class="page-publish__section-title">标题与详情</text>
            <text class="page-publish__section-sub">一句话概括，详情写清楚关键信息</text>
          </view>
        </view>

        <view class="page-publish__field">
          <view class="page-publish__field-head">
            <text
              class="page-publish__field-label"
              :class="{ 'page-publish__field-label--error': errors.title }"
            >
              标题<text class="page-publish__required">*</text>
            </text>
            <text class="page-publish__field-count">{{ form.title.length }}/50</text>
          </view>
          <view
            class="page-publish__input-wrap"
            :class="{ 'page-publish__input-wrap--error': errors.title }"
          >
            <u-input
              v-model="form.title"
              placeholder="例如：九成新 iPad，配件齐全"
              maxlength="50"
              border="none"
              :custom-style="inputStyle"
              @blur="touchField('title')"
            />
          </view>
          <text v-if="errors.title" class="page-publish__field-error">请填写标题</text>
        </view>

        <view id="publish-field-content" class="page-publish__field page-publish__field--last">
          <view class="page-publish__field-head">
            <text
              class="page-publish__field-label"
              :class="{ 'page-publish__field-label--error': errors.content }"
            >
              详情描述<text class="page-publish__required">*</text>
            </text>
            <text class="page-publish__field-count">{{ form.content.length }}/500</text>
          </view>
          <view
            class="page-publish__textarea-wrap"
            :class="{ 'page-publish__textarea-wrap--error': errors.content }"
          >
            <u-textarea
              v-model="form.content"
              placeholder="描述成色、时间、联系方式等，信息越完整越容易成交"
              maxlength="500"
              height="220rpx"
              border="none"
              :custom-style="textareaStyle"
              @blur="touchField('content')"
            />
          </view>
          <text v-if="errors.content" class="page-publish__field-error">请填写详情</text>
        </view>
      </view>

      <!-- 区块 3：价格与地址 -->
      <view class="page-publish__section cv-card">
        <view class="page-publish__section-head">
          <view class="page-publish__section-badge page-publish__section-badge--muted">3</view>
          <view class="page-publish__section-meta">
            <text class="page-publish__section-title">价格与位置</text>
            <text class="page-publish__section-sub">选填，有助于同城用户快速判断</text>
          </view>
        </view>

        <view class="page-publish__field">
          <text class="page-publish__field-label">价格（元）</text>
          <view class="page-publish__input-wrap page-publish__input-wrap--price">
            <text class="page-publish__currency">¥</text>
            <u-input
              v-model="form.price"
              type="digit"
              placeholder="留空表示面议"
              border="none"
              :custom-style="inputStyle"
            />
          </view>
        </view>

        <view class="page-publish__field page-publish__field--last">
          <view class="page-publish__field-head">
            <text class="page-publish__field-label">地址</text>
            <view class="page-publish__loc-btn" @click="onPickLocation">
              <u-icon name="map-fill" color="#1d4ed8" size="13" />
              <text>地图选点</text>
            </view>
          </view>
          <view class="page-publish__input-wrap">
            <u-input
              v-model="form.address"
              placeholder="小区、街道或地标，便于附近的人找到"
              border="none"
              :custom-style="inputStyle"
            />
          </view>
        </view>
      </view>

      <!-- 区块 4：图片 -->
      <view class="page-publish__section cv-card">
        <view class="page-publish__section-head">
          <view class="page-publish__section-badge page-publish__section-badge--muted">4</view>
          <view class="page-publish__section-meta">
            <text class="page-publish__section-title">添加图片</text>
            <text class="page-publish__section-sub">最多 6 张，校验通过后提交时上传</text>
          </view>
        </view>

        <view class="page-publish__upload">
          <u-upload
            :file-list="fileList"
            name="image"
            multiple
            :max-count="6"
            width="152rpx"
            height="152rpx"
            @after-read="onAfterRead"
            @delete="onDelete"
          />
        </view>
      </view>

      <!-- 审核提示 -->
      <view class="page-publish__notice">
        <u-icon name="info-circle" color="#8b9bb8" size="14" />
        <text>提交后将进入人工审核，通过后展示在首页与分类列表</text>
      </view>
      </template>
    </view>

    <!-- 底部提交栏（本页沉浸式，不展示 TabBar） -->
    <view class="page-publish__actions cv-bottom-bar">
      <view class="page-publish__submit-wrap">
        <u-button
          type="primary"
          :text="submitButtonText"
          shape="circle"
          :loading="submitting || uploadingImages"
          :disabled="submitting || uploadingImages"
          @click="onSubmit"
        />
      </view>
    </view>

  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import { onLoad, onShow } from '@dcloudio/uni-app';
import { postUploadImage } from '@/api/ai.api';
import { postCityInfo } from '@/api/city-info.api';
import { queryCategoryTree } from '@/api/category.api';
import CategoryRootStrip from '@/components/CategoryRootStrip/CategoryRootStrip.vue';
import SkeletonBlock from '@/components/SkeletonBlock/SkeletonBlock.vue';
import SkeletonLine from '@/components/SkeletonLine/SkeletonLine.vue';
import { useLocationStore } from '@/stores/location';
import { useTabBarStore } from '@/stores/tabbar';
import { useUserStore } from '@/stores/user';
import type { CategoryItem } from '@/types/city-info';

const tabBarStore = useTabBarStore();
const userStore = useUserStore();
const locationStore = useLocationStore();

const submitting = ref(false);
const pageLoading = ref(true);
const categories = ref<CategoryItem[]>([]);
const fileList = ref<{ url: string }[]>([]);
/** 是否正在上传待发布的图片（校验通过后） */
const uploadingImages = ref(false);
/** 当前展开的一级分类 ID */
const activeRootId = ref(0);
/** 用户是否已尝试提交，用于展示字段级错误 */
const submitAttempted = ref(false);
/** 已失焦校验过的字段 */
const touched = ref({ title: false, content: false });

const form = ref({
  categoryId: 0,
  title: '',
  content: '',
  price: '',
  address: '',
});

/** 已选分类展示文案 */
const categoryLabel = computed(() => {
  for (const root of categories.value) {
    const hit = (root.children || []).find((c) => c.id === form.value.categoryId);
    if (hit) return `${root.name} / ${hit.name}`;
  }
  return '';
});

/** u-input / u-textarea 内嵌样式：统一灰底圆角 */
const inputStyle = {
  backgroundColor: 'transparent',
  fontSize: '28rpx',
  color: '#0b1220',
};

const textareaStyle = {
  backgroundColor: 'transparent',
  fontSize: '28rpx',
  color: '#0b1220',
  lineHeight: '1.6',
};

/** 当前一级分类下的二级列表 */
const activeChildren = computed(() => {
  const root = categories.value.find((c) => c.id === activeRootId.value);
  return root?.children || [];
});

/** 必填项完成数量 */
const completionCount = computed(() => {
  let n = 0;
  if (form.value.categoryId) n += 1;
  if (form.value.title.trim()) n += 1;
  if (form.value.content.trim()) n += 1;
  return n;
});

/** 必填进度百分比，驱动顶部进度条 */
const completionPercent = computed(() => Math.round((completionCount.value / 3) * 100));

/** 是否满足提交条件 */
const canSubmit = computed(
  () =>
    !!form.value.categoryId &&
    !!form.value.title.trim() &&
    !!form.value.content.trim(),
);

/** 字段级错误：仅在提交尝试或失焦后展示 */
const errors = computed(() => ({
  categoryId: submitAttempted.value && !form.value.categoryId,
  title: (submitAttempted.value || touched.value.title) && !form.value.title.trim(),
  content: (submitAttempted.value || touched.value.content) && !form.value.content.trim(),
}));

/** 底部按钮文案随完成度变化 */
const submitButtonText = computed(() => {
  if (uploadingImages.value) return '正在上传图片…';
  if (submitting.value) return '提交中…';
  return canSubmit.value ? '提交发布' : `还差 ${3 - completionCount.value} 项必填`;
});

/** 选中一级分类并展开二级标签 */
function onSelectRoot(rootId: number) {
  activeRootId.value = rootId;
  const root = categories.value.find((c) => c.id === rootId);
  const children = root?.children || [];
  if (children.length === 1) {
    form.value.categoryId = children[0].id;
  } else if (!children.some((c) => c.id === form.value.categoryId)) {
    form.value.categoryId = 0;
  }
}

/** CategoryRootStrip 选中回调 */
function onSelectRootItem(item: CategoryItem) {
  onSelectRoot(item.id);
}

/** 选中二级分类 */
function onSelectCategory(id: number) {
  form.value.categoryId = id;
}

/** 根据 categoryId 反查并展开对应一级分类 */
function syncRootFromCategory(categoryId: number) {
  if (!categoryId) return;
  for (const root of categories.value) {
    if ((root.children || []).some((c) => c.id === categoryId)) {
      activeRootId.value = root.id;
      return;
    }
  }
}

/** 失焦时标记字段已触摸，触发即时校验 */
function touchField(field: 'title' | 'content') {
  touched.value[field] = true;
}

/** 地图选点 / 重新定位，填入地址 */
async function onPickLocation() {
  const result = await locationStore.openLocationAction();
  if (result !== 'cancelled') {
    form.value.address = locationStore.address || locationStore.cityName;
  }
}

/** 选择图片：仅加入本地预览，校验通过后再上传 */
function onAfterRead(event: {
  file: UniApp.UploadFileSuccessCallbackResultFile | UniApp.UploadFileSuccessCallbackResultFile[];
}) {
  const files = Array.isArray(event.file) ? event.file : [event.file];
  for (const f of files) {
    const path = (f as { url?: string }).url || '';
    if (!path) continue;
    fileList.value.push({ url: path });
  }
}

function onDelete(event: { index: number }) {
  fileList.value.splice(event.index, 1);
}

/** 校验通过后批量上传本地图片，返回服务端 URL 列表 */
async function uploadPendingImages(): Promise<string[]> {
  if (!fileList.value.length) return [];

  uploadingImages.value = true;
  const urls: string[] = [];
  try {
    for (let i = 0; i < fileList.value.length; i += 1) {
      const localPath = fileList.value[i].url;
      const res = await postUploadImage(localPath);
      urls.push(res.url);
    }
    return urls;
  } finally {
    uploadingImages.value = false;
  }
}

/** 发布页为独立子页，返回统一回到首页 Tab（避免 navigateBack 刷新当前页） */
function onBack() {
  tabBarStore.activeIndex = 0;
  tabBarStore.tabBarHidden = false;
  uni.switchTab({
    url: '/pages/home/index',
    fail: () => {
      uni.reLaunch({ url: '/pages/home/index' });
    },
  });
}

/** APP 端兜底：确保原生 TabBar 不露出 */
function hideNativeTabBar() {
  uni.hideTabBar({ animation: false, fail: () => {} });
}

/** 滚动定位到第一个未填写的必填项 */
async function scrollToFirstError() {
  await nextTick();

  let selector = '';
  if (!form.value.categoryId) {
    selector = '#publish-field-category';
  } else if (!form.value.title.trim()) {
    selector = '#publish-field-title';
  } else if (!form.value.content.trim()) {
    selector = '#publish-field-content';
  }
  if (!selector) return;

  uni.createSelectorQuery()
    .select(selector)
    .boundingClientRect()
    .selectViewport()
    .scrollOffset()
    .exec((res) => {
      const rect = res[0] as UniApp.NodeInfo | null;
      const viewport = res[1] as { scrollTop?: number } | null;
      if (!rect || rect.top === undefined || !viewport) return;

      const currentTop = viewport.scrollTop || 0;
      const targetTop = Math.max(currentTop + rect.top - 100, 0);
      uni.pageScrollTo({
        scrollTop: targetTop,
        duration: 300,
      });
    });
}

/** 提交发布 */
async function onSubmit() {
  submitAttempted.value = true;
  touched.value.title = true;
  touched.value.content = true;

  if (!userStore.isLoggedIn) {
    uni.navigateTo({ url: '/pages/auth/login' });
    return;
  }
  if (!canSubmit.value) {
    uni.showToast({ title: '请完成标红的必填项', icon: 'none' });
    await scrollToFirstError();
    return;
  }

  submitting.value = true;
  try {
    let imageUrls: string[] = [];
    try {
      imageUrls = await uploadPendingImages();
    } catch (e) {
      uni.showToast({ title: (e as Error).message || '图片上传失败，请重试', icon: 'none' });
      return;
    }

    await postCityInfo({
      categoryId: form.value.categoryId,
      title: form.value.title.trim(),
      content: form.value.content.trim(),
      price: form.value.price ? Number(form.value.price) : undefined,
      address: form.value.address || undefined,
      latitude: locationStore.latitude,
      longitude: locationStore.longitude,
      images: imageUrls,
    });
    uni.showToast({ title: '提交成功，等待审核', icon: 'success' });
    form.value = { categoryId: 0, title: '', content: '', price: '', address: '' };
    fileList.value = [];
    activeRootId.value = 0;
    submitAttempted.value = false;
    touched.value = { title: false, content: false };
    setTimeout(() => uni.switchTab({ url: '/pages/home/index' }), 800);
  } catch (e) {
    uni.showToast({ title: (e as Error).message || '发布失败', icon: 'none' });
  } finally {
    submitting.value = false;
  }
}

/** 支持从其他页带 categoryId 预填 */
onLoad((query) => {
  hideNativeTabBar();
  tabBarStore.syncFromRoute();
  const presetId = Number(query?.categoryId || 0);
  if (presetId) form.value.categoryId = presetId;
});

onShow(() => {
  hideNativeTabBar();
  tabBarStore.syncFromRoute();
});

onMounted(async () => {
  pageLoading.value = true;
  try {
    await locationStore.fetchLocation();
    categories.value = await queryCategoryTree();
    if (form.value.categoryId) {
      syncRootFromCategory(form.value.categoryId);
    } else if (categories.value.length) {
      activeRootId.value = categories.value[0].id;
    }
  } finally {
    pageLoading.value = false;
  }
});
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.page-publish__hero {
  position: relative;
  overflow: hidden;
  @include cv-hero-bg;
  padding: 28rpx $cv-space-page 48rpx;
  padding-top: calc(28rpx + env(safe-area-inset-top));
}

.page-publish__nav {
  position: relative;
  z-index: 2;
  margin-bottom: 8rpx;
}

.page-publish__back {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64rpx;
  height: 64rpx;
  border-radius: 20rpx;
  background: rgba(255, 255, 255, 0.12);
  border: 1rpx solid rgba(255, 255, 255, 0.2);
}

.page-publish__back--pressed {
  opacity: 0.82;
  transform: scale(0.96);
}

.page-publish__hero-orb {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.06);
  border: 1rpx solid rgba(255, 255, 255, 0.12);
  pointer-events: none;
}

.page-publish__hero-orb--1 {
  width: 220rpx;
  height: 220rpx;
  right: -40rpx;
  top: -20rpx;
}

.page-publish__hero-orb--2 {
  width: 120rpx;
  height: 120rpx;
  left: -20rpx;
  bottom: 16rpx;
}

.page-publish__title {
  position: relative;
  z-index: 1;
  display: block;
  font-size: 44rpx;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.05em;
}

.page-publish__desc {
  position: relative;
  z-index: 1;
  display: block;
  margin-top: 10rpx;
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.78);
  line-height: 1.5;
  max-width: 560rpx;
}

/** 顶部必填进度条 */
.page-publish__progress {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-top: 28rpx;
}

.page-publish__progress-track {
  flex: 1;
  height: 8rpx;
  border-radius: $cv-radius-pill;
  background: rgba(255, 255, 255, 0.18);
  overflow: hidden;
}

.page-publish__progress-fill {
  height: 100%;
  border-radius: $cv-radius-pill;
  background: linear-gradient(90deg, #fff 0%, rgba(255, 255, 255, 0.72) 100%);
  transition: width 0.35s $cv-ease-out;
}

.page-publish__progress-label {
  font-size: 22rpx;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.88);
  font-variant-numeric: tabular-nums;
  flex-shrink: 0;
}

.page-publish__body {
  @include cv-body-sheet;
  margin-top: -32rpx;
  padding-bottom: calc(300rpx + env(safe-area-inset-bottom));
}

/** 分组卡片：每个表单区块独立成卡 */
.page-publish__section {
  margin-bottom: 20rpx;
  padding: 28rpx 28rpx 32rpx;
  border: 1rpx solid transparent;
  transition: border-color 0.2s $cv-ease-out, box-shadow 0.2s $cv-ease-out;
}

/** 必填项校验失败：区块标红提示 */
.page-publish__section--error {
  border-color: rgba(220, 38, 38, 0.38);
  box-shadow: 0 0 0 4rpx rgba(220, 38, 38, 0.08);
}

.page-publish__required {
  margin-left: 4rpx;
  color: #dc2626;
  font-weight: 700;
}

.page-publish__section-head {
  display: flex;
  align-items: flex-start;
  gap: 18rpx;
  margin-bottom: 28rpx;
}

.page-publish__section-badge {
  width: 44rpx;
  height: 44rpx;
  border-radius: 14rpx;
  background: linear-gradient(155deg, $cv-hero-ink 0%, $cv-primary 100%);
  color: #fff;
  font-size: 24rpx;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 8rpx 20rpx rgba(29, 78, 216, 0.28);
}

.page-publish__section-badge--muted {
  background: $cv-surface-muted;
  color: $cv-text-secondary;
  box-shadow: none;
  border: 1rpx solid $cv-border;
}

.page-publish__section-badge--error {
  background: linear-gradient(155deg, #b91c1c 0%, #dc2626 100%);
  box-shadow: 0 8rpx 20rpx rgba(220, 38, 38, 0.24);
}

.page-publish__section-title--error {
  color: #dc2626;
}

.page-publish__section-meta {
  flex: 1;
  min-width: 0;
}

.page-publish__section-title {
  display: block;
  font-size: 30rpx;
  font-weight: 700;
  color: $cv-text;
  letter-spacing: -0.03em;
}

.page-publish__section-sub {
  display: block;
  margin-top: 6rpx;
  font-size: 24rpx;
  color: $cv-text-muted;
  line-height: 1.45;
}

.page-publish__section-tip {
  font-size: 22rpx;
  font-weight: 600;
  flex-shrink: 0;
  padding-top: 6rpx;
}

.page-publish__section-tip--warn {
  color: #dc2626;
}

/** 分类条校验失败高亮 */
.page-publish__category-strip--error {
  padding: 12rpx;
  margin: -12rpx;
  border-radius: $cv-radius-sm;
  background: #fef2f2;
  border: 1rpx solid rgba(220, 38, 38, 0.28);
}

/** 二级分类：本页唯一横向滚动区 */
.page-publish__chips-scroll {
  width: 100%;
  height: 80rpx;
  margin-top: 20rpx;
  white-space: nowrap;
}

.page-publish__chips {
  display: inline-flex;
  align-items: center;
  height: 80rpx;
  gap: 12rpx;
  padding: 0 4rpx;
  box-sizing: border-box;
}

.page-publish__chip {
  display: inline-flex;
  align-items: center;
  padding: 14rpx 28rpx;
  border-radius: $cv-radius-pill;
  font-size: 26rpx;
  font-weight: 500;
  color: $cv-text-secondary;
  background: $cv-surface-muted;
  border: 1rpx solid $cv-border;
  flex-shrink: 0;
  @include cv-pressable;

  &--active {
    color: $cv-primary;
    background: $cv-primary-soft;
    border-color: rgba(29, 78, 216, 0.22);
    font-weight: 600;
  }
}

.page-publish__picked {
  display: flex;
  align-items: center;
  gap: 14rpx;
  margin-top: 20rpx;
  padding: 18rpx 20rpx;
  border-radius: $cv-radius-sm;
  background: linear-gradient(135deg, rgba(29, 78, 216, 0.06) 0%, rgba(29, 78, 216, 0.12) 100%);
  border: 1rpx solid rgba(29, 78, 216, 0.14);
}

.page-publish__picked-icon {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.page-publish__picked-text {
  flex: 1;
  min-width: 0;
}

.page-publish__picked-label {
  display: block;
  font-size: 20rpx;
  color: $cv-text-muted;
  line-height: 1.3;
}

.page-publish__picked-value {
  display: block;
  margin-top: 4rpx;
  font-size: 26rpx;
  font-weight: 700;
  color: $cv-primary-dark;
  letter-spacing: -0.02em;
}

/** 垂直表单字段 */
.page-publish__field {
  margin-bottom: 28rpx;

  &--last {
    margin-bottom: 0;
  }
}

.page-publish__field-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14rpx;
}

.page-publish__field-label {
  font-size: 26rpx;
  font-weight: 600;
  color: $cv-text;
}

.page-publish__field-label--error {
  color: #dc2626;
}

.page-publish__field-count {
  font-size: 22rpx;
  color: $cv-text-muted;
  font-variant-numeric: tabular-nums;
}

.page-publish__input-wrap {
  display: flex;
  align-items: center;
  padding: 8rpx 24rpx;
  border-radius: $cv-radius-sm;
  background: $cv-surface-muted;
  border: 1rpx solid transparent;
  transition: border-color 0.2s $cv-ease-out, background 0.2s $cv-ease-out;

  &--price {
    gap: 8rpx;
  }

  &--error {
    border-color: rgba(220, 38, 38, 0.35);
    background: #fef2f2;
  }
}

.page-publish__currency {
  font-size: 32rpx;
  font-weight: 700;
  color: $cv-accent;
  flex-shrink: 0;
}

.page-publish__textarea-wrap {
  padding: 16rpx 20rpx;
  border-radius: $cv-radius-sm;
  background: $cv-surface-muted;
  border: 1rpx solid transparent;

  &--error {
    border-color: rgba(220, 38, 38, 0.35);
    background: #fef2f2;
  }
}

.page-publish__field-error {
  display: block;
  margin-top: 10rpx;
  font-size: 22rpx;
  color: #dc2626;
}

.page-publish__field-error--block {
  margin-top: 16rpx;
}

.page-publish__loc-btn {
  display: flex;
  align-items: center;
  gap: 6rpx;
  padding: 8rpx 16rpx;
  border-radius: $cv-radius-pill;
  background: $cv-primary-soft;
  font-size: 22rpx;
  font-weight: 600;
  color: $cv-primary;
  @include cv-pressable;
}

.page-publish__upload {
  :deep(.u-upload) {
    flex-wrap: wrap;
  }

  :deep(.u-upload__button) {
    border-radius: $cv-radius-sm !important;
    background: $cv-surface-muted !important;
    border: 1rpx dashed rgba(11, 18, 32, 0.12) !important;
  }
}

.page-publish__notice {
  display: flex;
  align-items: flex-start;
  gap: 12rpx;
  padding: 0 8rpx 16rpx;
  font-size: 24rpx;
  color: $cv-text-muted;
  line-height: 1.55;
}

.page-publish__actions {
  padding-top: 16rpx;
}

.page-publish__submit-wrap {
  :deep(.u-button) {
    border-radius: $cv-radius-pill;
    font-weight: 600;
    letter-spacing: 0.02em;
  }

  :deep(.u-button--disabled) {
    opacity: 0.72;
  }
}

.page-publish__section--sk {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
</style>
