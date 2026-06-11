<template>
  <view class="page-collect">
    <InfoCard v-for="item in list" :key="item.id" :item="item" @click="goDetail" />
    <u-empty v-if="!loading && !list.length" mode="favor" text="暂无收藏" />
    <AiAssistantFab />
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { queryCollectList } from '@/api/collect.api';
import AiAssistantFab from '@/components/AiAssistantFab/AiAssistantFab.vue';
import InfoCard from '@/components/InfoCard/InfoCard.vue';
import type { CityInfoItem } from '@/types/city-info';

const list = ref<CityInfoItem[]>([]);
const loading = ref(false);

function goDetail(item: CityInfoItem) {
  uni.navigateTo({ url: `/pages/info/detail?id=${item.id}` });
}

onMounted(async () => {
  loading.value = true;
  try {
    const res = await queryCollectList(1, 50);
    list.value = res.list
      .map((c) => c.info)
      .filter(Boolean) as CityInfoItem[];
  } finally {
    loading.value = false;
  }
});
</script>

<style lang="scss" scoped>
@import '@/styles/mixins.scss';

.page-collect {
  @include cv-subpage-body;
}
</style>
