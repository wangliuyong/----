<template>
  <view class="page-loc-picker">
    <!-- 顶部导航 -->
    <view class="page-loc-picker__nav" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="page-loc-picker__nav-inner">
        <view class="page-loc-picker__back" @click="onCancel">
          <u-icon name="arrow-left" color="#1e293b" size="20" />
        </view>
        <text class="page-loc-picker__title">地图选点</text>
        <view class="page-loc-picker__placeholder" />
      </view>
    </view>

    <!-- 地图区域：拖动地图，中心标记即为选中位置 -->
    <view class="page-loc-picker__map-wrap">
      <map
        id="locationMap"
        class="page-loc-picker__map"
        :latitude="latitude"
        :longitude="longitude"
        :scale="16"
        show-location
        enable-3D
        enable-zoom
        enable-scroll
        @regionchange="onRegionChange"
      />
      <!-- 中心固定图钉 -->
      <view class="page-loc-picker__pin">
        <u-icon name="map-fill" color="#1d4ed8" size="36" />
      </view>
    </view>

    <!-- 底部操作区 -->
    <view class="page-loc-picker__panel cv-card">
      <view class="page-loc-picker__addr">
        <u-icon name="map" color="#1d4ed8" size="16" />
        <text class="page-loc-picker__addr-text">{{ addressPreview || '拖动地图选择位置' }}</text>
      </view>
      <view class="page-loc-picker__actions">
        <view class="page-loc-picker__btn page-loc-picker__btn--ghost" @click="onRelocate">
          <u-icon name="reload" color="#1d4ed8" size="16" />
          <text>定位到当前</text>
        </view>
        <view
          class="page-loc-picker__btn page-loc-picker__btn--primary"
          :class="{ 'page-loc-picker__btn--disabled': confirming }"
          @click="onConfirm"
        >
          <text>{{ confirming ? '解析中...' : '确认选点' }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, getCurrentInstance } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { queryReverseGeocode } from '@/utils/geocode';
import { getCurrentPosition } from '@/utils/location';
import { useLocationStore } from '@/stores/location';

const locationStore = useLocationStore();

const statusBarHeight = ref(0);
const latitude = ref(locationStore.latitude);
const longitude = ref(locationStore.longitude);
const addressPreview = ref(locationStore.address || locationStore.cityName);
const confirming = ref(false);

/** 地图上下文，用于读取中心点坐标 */
let mapCtx: UniApp.MapContext | null = null;

onLoad(() => {
  const sys = uni.getSystemInfoSync();
  statusBarHeight.value = sys.statusBarHeight || 0;
});

onMounted(() => {
  mapCtx = uni.createMapContext('locationMap', getCurrentInstance()?.proxy);
});

/** 地图拖动结束后更新中心坐标并预览地址 */
function onRegionChange(e: { type?: string }) {
  if (e.type !== 'end') return;
  mapCtx?.getCenterLocation({
    success: async (res) => {
      latitude.value = res.latitude;
      longitude.value = res.longitude;
      try {
        const geo = await queryReverseGeocode(res.latitude, res.longitude);
        addressPreview.value = geo.address || geo.cityName;
      } catch {
        addressPreview.value = `${res.latitude.toFixed(4)}, ${res.longitude.toFixed(4)}`;
      }
    },
  });
}

/** 重新定位到当前 GPS 位置 */
async function onRelocate() {
  uni.showLoading({ title: '定位中...' });
  try {
    const pos = await getCurrentPosition();
    latitude.value = pos.latitude;
    longitude.value = pos.longitude;
    mapCtx?.moveToLocation({});
    const geo = await queryReverseGeocode(pos.latitude, pos.longitude);
    addressPreview.value = geo.address || geo.cityName;
    uni.showToast({ title: '已定位到当前位置', icon: 'none' });
  } catch {
    uni.showToast({ title: '定位失败，请检查权限', icon: 'none' });
  } finally {
    uni.hideLoading();
  }
}

/** 确认选点并回传上一页 */
async function onConfirm() {
  if (confirming.value) return;
  confirming.value = true;

  try {
    const geo = await queryReverseGeocode(latitude.value, longitude.value);
    const payload = {
      latitude: latitude.value,
      longitude: longitude.value,
      cityName: geo.cityName,
      address: geo.address || addressPreview.value,
    };

    const instance = getCurrentInstance()?.proxy as {
      getOpenerEventChannel?: () => UniApp.EventChannel;
    };
    const channel = instance?.getOpenerEventChannel?.();
    if (channel) {
      channel.emit('acceptLocation', payload);
    } else {
      locationStore.applyLocation(payload);
    }

    uni.navigateBack();
  } catch {
    uni.showToast({ title: '地址解析失败，请重试', icon: 'none' });
  } finally {
    confirming.value = false;
  }
}

function onCancel() {
  uni.navigateBack();
}
</script>

<style lang="scss" scoped>
.page-loc-picker {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #e8ecf3;
}

.page-loc-picker__nav {
  background: #fff;
  box-shadow: 0 2rpx 16rpx rgba(15, 23, 42, 0.06);
  z-index: 10;
}

.page-loc-picker__nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 88rpx;
  padding: 0 24rpx;
}

.page-loc-picker__back {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-loc-picker__title {
  font-size: 32rpx;
  font-weight: 600;
  color: #1e293b;
}

.page-loc-picker__placeholder {
  width: 64rpx;
}

.page-loc-picker__map-wrap {
  flex: 1;
  position: relative;
  min-height: 55vh;
}

.page-loc-picker__map {
  width: 100%;
  height: 100%;
  min-height: 55vh;
}

/** 中心图钉：固定在地图视觉中心 */
.page-loc-picker__pin {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -100%);
  pointer-events: none;
  z-index: 5;
}

.page-loc-picker__panel {
  margin: 24rpx;
  padding: 28rpx;
  border-radius: 24rpx;
}

.page-loc-picker__addr {
  display: flex;
  align-items: flex-start;
  gap: 12rpx;
  margin-bottom: 24rpx;
}

.page-loc-picker__addr-text {
  flex: 1;
  font-size: 28rpx;
  color: #334155;
  line-height: 1.5;
}

.page-loc-picker__actions {
  display: flex;
  gap: 20rpx;
}

.page-loc-picker__btn {
  flex: 1;
  height: 88rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  font-size: 28rpx;
  font-weight: 500;
}

.page-loc-picker__btn--ghost {
  background: #eff6ff;
  color: #1d4ed8;
}

.page-loc-picker__btn--primary {
  background: linear-gradient(135deg, #1d4ed8, #2563eb);
  color: #fff;
}

.page-loc-picker__btn--disabled {
  opacity: 0.6;
}
</style>
