<template>
  <view class="page-publish cv-page">
    <view class="page-publish__hero">
      <view class="page-publish__hero-glow" />
      <text class="page-publish__title">发布便民信息</text>
      <text class="page-publish__desc">填写真实信息，审核通过后展示</text>
    </view>

    <view class="page-publish__body">
      <view class="page-publish__form cv-form-panel">
        <u-form ref="formRef" :model="form" label-width="160rpx">
          <u-form-item label="分类" prop="categoryId" required>
            <u-picker
              :show="pickerShow"
              :columns="pickerColumns"
              key-name="label"
              @confirm="onPickCategory"
              @cancel="pickerShow = false"
            />
            <view class="page-publish__picker" @click="pickerShow = true">
              <text :class="{ 'page-publish__picker--empty': !categoryLabel }">
                {{ categoryLabel || '请选择分类' }}
              </text>
              <u-icon name="arrow-down" size="14" color="#8b9bb8" />
            </view>
          </u-form-item>

          <u-form-item label="标题" prop="title" required>
            <u-input v-model="form.title" placeholder="请输入标题" maxlength="50" />
          </u-form-item>

          <u-form-item label="价格" prop="price">
            <u-input v-model="form.price" type="digit" placeholder="选填，单位元" />
          </u-form-item>

          <u-form-item label="地址" prop="address">
            <u-input v-model="form.address" placeholder="选填，便于同城展示" />
          </u-form-item>

          <u-form-item label="详情" prop="content" required>
            <u-textarea
              v-model="form.content"
              placeholder="请描述详细信息"
              maxlength="500"
              count
              height="200rpx"
            />
          </u-form-item>

          <u-form-item label="图片">
            <u-upload
              :file-list="fileList"
              name="image"
              multiple
              :max-count="6"
              @after-read="onAfterRead"
              @delete="onDelete"
            />
          </u-form-item>
        </u-form>
      </view>
    </view>

    <view class="page-publish__actions cv-bottom-bar cv-bottom-bar--above-tab">
      <u-button type="primary" text="提交发布" shape="circle" :loading="submitting" @click="onSubmit" />
    </view>

    <!-- #ifndef MP-WEIXIN -->
    <AppTabBar />
    <!-- #endif -->
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { postUploadImage } from '@/api/ai.api';
import { postCityInfo } from '@/api/city-info.api';
import { queryCategoryTree } from '@/api/category.api';
import AppTabBar from '@/components/AppTabBar/AppTabBar.vue';
import { useTabBarPage } from '@/composables/useTabBarPage';
import { useLocationStore } from '@/stores/location';
import { useUserStore } from '@/stores/user';
import type { CategoryItem } from '@/types/city-info';

useTabBarPage();

const userStore = useUserStore();
const locationStore = useLocationStore();

const formRef = ref();
const pickerShow = ref(false);
const submitting = ref(false);
const categories = ref<CategoryItem[]>([]);
const fileList = ref<{ url: string }[]>([]);

const form = ref({
  categoryId: 0,
  title: '',
  content: '',
  price: '',
  address: '',
});

/** 扁平化二级分类供选择 */
const flatCategories = computed(() => {
  const list: { id: number; label: string }[] = [];
  categories.value.forEach((root) => {
    (root.children || []).forEach((child) => {
      list.push({ id: child.id, label: `${root.name} / ${child.name}` });
    });
  });
  return list;
});

const pickerColumns = computed(() => [flatCategories.value]);

const categoryLabel = computed(() => {
  const hit = flatCategories.value.find((c) => c.id === form.value.categoryId);
  return hit?.label || '';
});

function onPickCategory(e: { value: { id: number; label: string }[] }) {
  const item = e.value[0];
  form.value.categoryId = item.id;
  pickerShow.value = false;
}

/** 选择图片后 Mock 上传 */
async function onAfterRead(event: { file: UniApp.UploadFileSuccessCallbackResultFile | UniApp.UploadFileSuccessCallbackResultFile[] }) {
  const files = Array.isArray(event.file) ? event.file : [event.file];
  for (const f of files) {
    const path = (f as { url?: string }).url || '';
    if (!path) continue;
    const res = await postUploadImage(path);
    fileList.value.push({ url: res.url });
  }
}

function onDelete(event: { index: number }) {
  fileList.value.splice(event.index, 1);
}

/** 提交发布 */
async function onSubmit() {
  if (!userStore.isLoggedIn) {
    uni.navigateTo({ url: '/pages/auth/login' });
    return;
  }
  if (!form.value.categoryId) {
    uni.showToast({ title: '请选择分类', icon: 'none' });
    return;
  }
  if (!form.value.title.trim() || !form.value.content.trim()) {
    uni.showToast({ title: '请填写标题和详情', icon: 'none' });
    return;
  }

  submitting.value = true;
  try {
    await postCityInfo({
      categoryId: form.value.categoryId,
      title: form.value.title.trim(),
      content: form.value.content.trim(),
      price: form.value.price ? Number(form.value.price) : undefined,
      address: form.value.address || undefined,
      latitude: locationStore.latitude,
      longitude: locationStore.longitude,
      images: fileList.value.map((f) => f.url),
    });
    uni.showToast({ title: '提交成功，等待审核', icon: 'success' });
    form.value = { categoryId: 0, title: '', content: '', price: '', address: '' };
    fileList.value = [];
    setTimeout(() => uni.switchTab({ url: '/pages/home/index' }), 800);
  } catch (e) {
    uni.showToast({ title: (e as Error).message || '发布失败', icon: 'none' });
  } finally {
    submitting.value = false;
  }
}

onMounted(async () => {
  categories.value = await queryCategoryTree();
});
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.page-publish__hero {
  position: relative;
  overflow: hidden;
  @include cv-hero-bg;
  padding: 32rpx $cv-space-page 56rpx;
  padding-top: calc(32rpx + env(safe-area-inset-top));
}

.page-publish__hero-glow {
  @include cv-hero-orb(260rpx, -30rpx, -40rpx);
}

.page-publish__title {
  position: relative;
  z-index: 1;
  display: block;
  font-size: 48rpx;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.05em;
}

.page-publish__desc {
  position: relative;
  z-index: 1;
  display: block;
  margin-top: 12rpx;
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
}

.page-publish__body {
  @include cv-body-sheet;
  margin-top: -36rpx;
  padding-bottom: calc(280rpx + #{$cv-tabbar-height} + env(safe-area-inset-bottom));
}

.page-publish__form {
  margin: 0;
}

.page-publish__picker {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 16rpx 0;
  color: $cv-text;
  font-size: 28rpx;
}

.page-publish__picker--empty {
  color: $cv-text-muted;
}

.page-publish__actions {
  :deep(.u-button) {
    border-radius: $cv-radius-pill;
  }
}
</style>
