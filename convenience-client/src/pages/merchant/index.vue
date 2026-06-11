<template>
  <view class="page-merchant cv-subpage">
    <u-empty mode="data" text="商家端分包预留，后续迭代" />
    <AiAssistantFab />
  </view>
</template>

<script setup lang="ts">
import AiAssistantFab from '@/components/AiAssistantFab/AiAssistantFab.vue';
</script>

<style lang="scss" scoped>
.page-merchant {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
