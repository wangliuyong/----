<template>
  <view class="page-report">
    <view class="page-report__form cv-form-panel">
      <u-form :model="form" label-width="160rpx">
        <u-form-item label="举报类型" required>
          <u-radio-group v-model="form.reportType" placement="column">
            <u-radio v-for="item in typeOptions" :key="item.value" :name="item.value" :label="item.label"
              active-color="#1d4ed8" />
          </u-radio-group>
        </u-form-item>
        <u-form-item label="补充说明" required>
          <u-textarea v-model="form.content" placeholder="请描述违规情况" maxlength="200" count height="200rpx" />
        </u-form-item>
      </u-form>
    </view>

    <view class="page-report__actions">
      <u-button type="primary" text="提交举报" shape="circle" :loading="submitting" @click="onSubmit" />
    </view>
    <AiAssistantFab />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { postReport } from '@/api/report.api';
import AiAssistantFab from '@/components/AiAssistantFab/AiAssistantFab.vue';
import type { ReportType } from '@/types/city-info';
import { REPORT_TYPE_LABEL } from '@/utils/format';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const submitting = ref(false);
const infoId = ref(0);

const form = ref<{ reportType: ReportType; content: string }>({
  reportType: 'SPAM',
  content: '',
});

const typeOptions = Object.entries(REPORT_TYPE_LABEL).map(([value, label]) => ({
  value: value as ReportType,
  label,
}));

onLoad((query) => {
  infoId.value = Number(query?.infoId || 0);
});

async function onSubmit() {
  if (!userStore.isLoggedIn) {
    uni.navigateTo({ url: '/pages/auth/login' });
    return;
  }
  if (!infoId.value) {
    uni.showToast({ title: '缺少信息 ID', icon: 'none' });
    return;
  }
  if (!form.value.content.trim()) {
    uni.showToast({ title: '请填写说明', icon: 'none' });
    return;
  }

  submitting.value = true;
  try {
    await postReport({
      infoId: infoId.value,
      reportType: form.value.reportType,
      content: form.value.content.trim(),
    });
    uni.showToast({ title: '举报已提交', icon: 'success' });
    setTimeout(() => uni.navigateBack(), 800);
  } catch (e) {
    uni.showToast({ title: (e as Error).message, icon: 'none' });
  } finally {
    submitting.value = false;
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/mixins.scss';

.page-report {
  @include cv-subpage-body;
}

.page-report__form {
  margin: 0;
}

.page-report__actions {
  margin-top: 48rpx;
  padding: 0 16rpx;
}
</style>
