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
      <!-- #ifdef H5 -->
      <LocationMapAmapH5
        ref="amapRef"
        :latitude="latitude"
        :longitude="longitude"
        :zoom="16"
        @moveend="onMapMoveEnd"
      />
      <!-- #endif -->
      <!-- #ifndef H5 -->
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
      <!-- #endif -->
      <!-- 中心固定图钉 -->
      <view class="page-loc-picker__pin">
        <u-icon name="map-fill" color="#1d4ed8" size="36" />
      </view>
      <!-- 地图右上角：快捷定位到当前 -->
      <view
        class="page-loc-picker__locate-fab"
        :class="{ 'page-loc-picker__locate-fab--disabled': relocating }"
        @click="() => onRelocate()"
      >
        <u-icon name="reload" color="#1d4ed8" size="20" />
      </view>
    </view>

    <!-- 底部操作区 -->
    <view class="page-loc-picker__panel cv-card">
      <view class="page-loc-picker__addr">
        <u-icon name="map" color="#1d4ed8" size="16" />
        <text class="page-loc-picker__addr-text">{{ addressPreview || '拖动地图选择位置' }}</text>
      </view>
      <view class="page-loc-picker__actions">
        <view
          class="page-loc-picker__btn page-loc-picker__btn--ghost"
          :class="{ 'page-loc-picker__btn--disabled': relocating }"
          @click="onRelocate()"
        >
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
import { ensureLocationPermission, getCurrentPosition } from '@/utils/location';
import { isApp, isMpWeixin } from '@/utils/platform';
import { useLocationStore } from '@/stores/location';
// #ifdef H5
import LocationMapAmapH5 from '@/components/LocationMapAmap/LocationMapAmapH5.vue';
// #endif

const locationStore = useLocationStore();

const statusBarHeight = ref(0);
const latitude = ref(locationStore.latitude);
const longitude = ref(locationStore.longitude);
const addressPreview = ref(locationStore.address || locationStore.cityName);
const confirming = ref(false);
/** 是否正在定位到当前位置 */
const relocating = ref(false);

// #ifdef H5
/** H5 高德地图组件引用 */
const amapRef = ref<InstanceType<typeof LocationMapAmapH5> | null>(null);
// #endif

// #ifndef H5
/** 原生 map 上下文（小程序 / App） */
let mapCtx: UniApp.MapContext | null = null;
// #endif

onLoad(() => {
  const sys = uni.getSystemInfoSync();
  statusBarHeight.value = sys.statusBarHeight || 0;
});

onMounted(() => {
  // #ifndef H5
  mapCtx = uni.createMapContext('locationMap', getCurrentInstance()?.proxy);
  // #endif
  /** 进入选点页自动定位到当前位置（失败时保留上次坐标，不打断用户） */
  void onRelocate({ silent: true });
});

/** 逆地理预览地址 */
async function previewAddress(lat: number, lng: number) {
  try {
    const geo = await queryReverseGeocode(lat, lng);
    addressPreview.value = geo.address || geo.cityName;
  } catch {
    addressPreview.value = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
}

// #ifdef H5
/** H5 高德地图拖动结束 */
function onMapMoveEnd(lat: number, lng: number) {
  latitude.value = lat;
  longitude.value = lng;
  void previewAddress(lat, lng);
}
// #endif

// #ifndef H5
/** 小程序 / App 原生 map 拖动结束 */
function onRegionChange(e: { type?: string }) {
  if (e.type !== 'end') return;
  mapCtx?.getCenterLocation({
    success: (res) => {
      latitude.value = res.latitude;
      longitude.value = res.longitude;
      void previewAddress(res.latitude, res.longitude);
    },
  });
}
// #endif

/** 定位到当前 GPS 位置，并将地图中心移动到该点 */
async function onRelocate(options: { silent?: boolean } = {}) {
  const { silent = false } = options;
  if (relocating.value) return;
  relocating.value = true;
  if (!silent) {
    uni.showLoading({ title: '定位中...' });
  }

  try {
    /** 小程序 / App 需先申请定位权限 */
    if (isMpWeixin() || isApp()) {
      const granted = await ensureLocationPermission();
      if (!granted) {
        if (!silent) {
          uni.showToast({ title: '未获得定位权限', icon: 'none' });
        }
        return;
      }
    }

    const pos = await getCurrentPosition();
    // #ifdef H5
    /** 等地图就绪后更新坐标，由 props watch 触发 moveTo 并同步地址 */
    await amapRef.value?.whenReady?.();
    // #endif
    latitude.value = pos.latitude;
    longitude.value = pos.longitude;

    // #ifndef H5
    /** 原生 map 通过 props 更新中心点 */
    await previewAddress(pos.latitude, pos.longitude);
    // #endif

    if (!silent) {
      uni.showToast({ title: '已定位到当前位置', icon: 'none' });
    }
  } catch (err) {
    if (!silent) {
      uni.showToast({
        title: err instanceof Error ? err.message : '定位失败，请检查权限',
        icon: 'none',
        duration: 3000,
      });
    }
  } finally {
    relocating.value = false;
    if (!silent) {
      uni.hideLoading();
    }
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
  height: 100dvh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #e8ecf3;
}

.page-loc-picker__nav {
  flex-shrink: 0;
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
  min-height: 0;
  position: relative;
  overflow: hidden;
}

.page-loc-picker__map {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
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

/** 地图右上角定位按钮（与底部「定位到当前」功能一致） */
.page-loc-picker__locate-fab {
  position: absolute;
  right: 24rpx;
  bottom: 32rpx;
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 8rpx 24rpx rgba(15, 23, 42, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 6;
}

.page-loc-picker__locate-fab--disabled {
  opacity: 0.5;
  pointer-events: none;
}

.page-loc-picker__panel {
  flex-shrink: 0;
  margin: 0;
  padding: 28rpx 24rpx calc(24rpx + env(safe-area-inset-bottom));
  border-radius: 24rpx 24rpx 0 0;
  box-shadow: 0 -8rpx 32rpx rgba(15, 23, 42, 0.06);
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
