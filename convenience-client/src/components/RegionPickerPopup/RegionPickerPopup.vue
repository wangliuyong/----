<template>
  <!-- 省市区弹层：页面根级挂载，钴蓝编辑风 bottom sheet -->
  <u-popup
    :show="show"
    mode="bottom"
    :round="24"
    :z-index="10080"
    :overlay-opacity="0.52"
    :close-on-click-overlay="true"
    @close="onClose"
  >
    <view class="region-picker">
      <!-- 拖拽指示条 -->
      <view class="region-picker__handle-wrap">
        <view class="region-picker__handle" />
      </view>

      <!-- 标题区 -->
      <view class="region-picker__head">
        <view class="region-picker__head-icon">
          <u-icon name="map-fill" color="#1d4ed8" size="18" />
        </view>
        <view class="region-picker__head-text">
          <text class="region-picker__title">选择所在区域</text>
          <text class="region-picker__subtitle">浏览同城便民信息时将优先展示该区域内容</text>
        </view>
      </view>

      <!-- 当前选中预览 -->
      <view class="region-picker__preview">
        <text class="region-picker__preview-label">当前选择</text>
        <text class="region-picker__preview-value">{{ previewText }}</text>
      </view>

      <!-- 列标题 -->
      <view class="region-picker__columns-head">
        <text class="region-picker__col-label">省份</text>
        <text class="region-picker__col-label">城市</text>
        <text class="region-picker__col-label">区县</text>
      </view>

      <!-- 滚轮 + 中心高亮带 -->
      <view class="region-picker__wheel-wrap">
        <view class="region-picker__wheel-highlight" />
        <view class="region-picker__wheel-fade region-picker__wheel-fade--top" />
        <view class="region-picker__wheel-fade region-picker__wheel-fade--bottom" />
        <picker-view
          class="region-picker__wheel"
          :value="pickerIndex"
          indicator-style="height: 80rpx; background: transparent;"
          mask-style="background: transparent;"
          @change="onPickerChange"
        >
          <picker-view-column>
            <view
              v-for="item in provinceList"
              :key="item.value"
              class="region-picker__wheel-item"
            >
              {{ item.text }}
            </view>
          </picker-view-column>
          <picker-view-column>
            <view
              v-for="item in cityList"
              :key="item.value"
              class="region-picker__wheel-item"
            >
              {{ item.text }}
            </view>
          </picker-view-column>
          <picker-view-column>
            <view
              v-for="item in districtList"
              :key="item.value || item.text"
              class="region-picker__wheel-item"
            >
              {{ item.text }}
            </view>
          </picker-view-column>
        </picker-view>
      </view>

      <!-- 底部操作 -->
      <view class="region-picker__footer">
        <view class="region-picker__btn region-picker__btn--ghost" @tap="onClose">
          取消
        </view>
        <view class="region-picker__btn region-picker__btn--primary" @tap="onConfirm">
          确认区域
        </view>
      </view>
    </view>
  </u-popup>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  buildRegionPickerColumns,
  parseRegionPickerValue,
  queryCitiesByProvince,
  queryDistrictsByCity,
  queryPickerDefaultIndex,
  queryProvinces,
  queryRegionCodes,
  type RegionOption,
} from '@/utils/china-region';

const props = defineProps<{
  show: boolean;
  province: string;
  city: string;
  district: string;
}>();

const emit = defineEmits<{
  'update:show': [value: boolean];
  confirm: [payload: { province: string; city: string; district: string }];
}>();

const provinceList = queryProvinces();
const cityList = ref<RegionOption[]>([]);
const districtList = ref<RegionOption[]>([]);
const pickerIndex = ref<number[]>([0, 0, 0]);

/** 滚轮实时预览文案 */
const previewText = computed(() => {
  const p = provinceList[pickerIndex.value[0]]?.text;
  const c = cityList.value[pickerIndex.value[1]]?.text;
  const d = districtList.value[pickerIndex.value[2]]?.text;
  if (!p) return '请选择';
  const parts = [p, c, d].filter((x) => x && x !== '市辖区');
  return parts.join(' / ') || p;
});

/** 弹层打开时按当前区域初始化三列数据 */
function initPickerState() {
  const codes = queryRegionCodes(props.province, props.city, props.district);
  const columns = buildRegionPickerColumns(codes);
  cityList.value = columns[1];
  districtList.value = columns[2];
  pickerIndex.value = queryPickerDefaultIndex(columns, codes);
}

watch(
  () => props.show,
  (val) => {
    if (val) initPickerState();
  },
);

/** 滚轮变化：联动市、区列 */
function onPickerChange(e: { detail: { value: number[] } }) {
  const next = e.detail.value;
  const prev = pickerIndex.value;

  if (next[0] !== prev[0]) {
    const provinceCode = provinceList[next[0]]?.value || '';
    cityList.value = queryCitiesByProvince(provinceCode);
    districtList.value = queryDistrictsByCity(cityList.value[0]?.value || '');
    pickerIndex.value = [next[0], 0, 0];
    return;
  }

  if (next[1] !== prev[1]) {
    const cityCode = cityList.value[next[1]]?.value || '';
    districtList.value = queryDistrictsByCity(cityCode);
    pickerIndex.value = [next[0], next[1], 0];
    return;
  }

  pickerIndex.value = next;
}

function onClose() {
  emit('update:show', false);
}

function onConfirm() {
  const items: RegionOption[] = [
    provinceList[pickerIndex.value[0]],
    cityList.value[pickerIndex.value[1]],
    districtList.value[pickerIndex.value[2]],
  ].filter(Boolean);

  const parsed = parseRegionPickerValue(items);
  if (!parsed.province || !parsed.city) {
    uni.showToast({ title: '请选择完整区域', icon: 'none' });
    return;
  }

  emit('confirm', parsed);
  onClose();
}
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';

/** 选择器字号阶梯：标题 < 预览值 ≈ 滚轮 > 辅助文案 */
$rp-title: 32rpx;
$rp-body: 26rpx;
$rp-caption: 24rpx;
$rp-wheel: 30rpx;
$rp-btn: 28rpx;
$rp-wheel-row: 80rpx;

.region-picker {
  background: $cv-surface;
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
  border-radius: 24rpx 24rpx 0 0;
  overflow: hidden;
}

/** 顶部拖拽条 */
.region-picker__handle-wrap {
  display: flex;
  justify-content: center;
  padding: 16rpx 0 8rpx;
}

.region-picker__handle {
  width: 72rpx;
  height: 8rpx;
  border-radius: $cv-radius-pill;
  background: rgba(29, 78, 216, 0.18);
}

/** 标题区 */
.region-picker__head {
  display: flex;
  align-items: flex-start;
  gap: 20rpx;
  padding: 8rpx $cv-space-page 24rpx;
}

.region-picker__head-icon {
  width: 72rpx;
  height: 72rpx;
  border-radius: 20rpx;
  background: $cv-primary-soft;
  border: 1rpx solid $cv-primary-border;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.region-picker__head-text {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  padding-top: 4rpx;
}

.region-picker__title {
  font-size: $rp-title;
  font-weight: 700;
  color: $cv-text;
  letter-spacing: -0.02em;
  line-height: 1.25;
}

.region-picker__subtitle {
  font-size: $rp-body;
  color: $cv-text-secondary;
  line-height: 1.5;
}

/** 选中预览条 */
.region-picker__preview {
  margin: 0 $cv-space-page 20rpx;
  padding: 20rpx 24rpx;
  border-radius: $cv-radius-sm;
  background: linear-gradient(135deg, rgba(29, 78, 216, 0.08) 0%, rgba(191, 219, 254, 0.35) 100%);
  border: 1rpx solid $cv-primary-border;
  box-shadow: $cv-shadow-inset;
}

.region-picker__preview-label {
  display: block;
  font-size: $rp-caption;
  color: $cv-text-secondary;
  margin-bottom: 8rpx;
}

.region-picker__preview-value {
  display: block;
  font-size: $rp-title;
  font-weight: 700;
  color: $cv-primary-dark;
  letter-spacing: -0.01em;
  line-height: 1.35;
}

/** 列标题 */
.region-picker__columns-head {
  display: flex;
  padding: 0 $cv-space-page 16rpx;
}

.region-picker__col-label {
  flex: 1;
  text-align: center;
  font-size: $rp-caption;
  font-weight: 600;
  color: $cv-text-secondary;
}

/** 滚轮容器 */
.region-picker__wheel-wrap {
  position: relative;
  margin: 0 $cv-space-page;
  height: 400rpx;
  border-radius: $cv-radius-sm;
  background: #fff;
  border: 1rpx solid $cv-border-strong;
  overflow: hidden;
}

/** 选中行背景：置于文字下层，避免遮挡 */
.region-picker__wheel-highlight {
  position: absolute;
  left: 12rpx;
  right: 12rpx;
  top: 50%;
  height: $rp-wheel-row;
  margin-top: calc(#{$rp-wheel-row} / -2);
  border-radius: 14rpx;
  background: rgba(29, 78, 216, 0.1);
  border: 2rpx solid rgba(29, 78, 216, 0.35);
  pointer-events: none;
  z-index: 1;
}

.region-picker__wheel-fade {
  position: absolute;
  left: 0;
  right: 0;
  height: 72rpx;
  pointer-events: none;
  z-index: 3;
}

.region-picker__wheel-fade--top {
  top: 0;
  background: linear-gradient(180deg, #fff 30%, rgba(255, 255, 255, 0) 100%);
}

.region-picker__wheel-fade--bottom {
  bottom: 0;
  background: linear-gradient(0deg, #fff 30%, rgba(255, 255, 255, 0) 100%);
}

.region-picker__wheel {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 400rpx;
}

.region-picker__wheel-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: $rp-wheel-row;
  font-size: $rp-wheel;
  font-weight: 600;
  color: $cv-text;
  line-height: 1.3;
  padding: 0 6rpx;
  text-align: center;
  -webkit-font-smoothing: antialiased;
}

/** 底部按钮 */
.region-picker__footer {
  display: flex;
  gap: 20rpx;
  padding: 28rpx $cv-space-page 0;
}

.region-picker__btn {
  flex: 1;
  height: 88rpx;
  border-radius: $cv-radius-pill;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: $rp-btn;
  font-weight: 600;
  transition: transform 0.2s $cv-ease-out, opacity 0.2s $cv-ease-out;

  &:active {
    transform: scale(0.98);
    opacity: 0.92;
  }
}

.region-picker__btn--ghost {
  background: #fff;
  color: $cv-text;
  border: 1rpx solid $cv-border-strong;
}

.region-picker__btn--primary {
  flex: 1.4;
  color: #fff;
  background: linear-gradient(135deg, $cv-primary-dark 0%, $cv-primary 55%, $cv-primary-mid 100%);
  box-shadow: 0 12rpx 32rpx rgba(29, 78, 216, 0.28);
}
</style>
