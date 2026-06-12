<template>
  <!-- H5 高德地图容器（uni-app map 组件在 H5 上瓦片常无法显示，改用 JS API） -->
  <view :id="containerId" class="location-map-amap-h5" />
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, watch } from 'vue';
import { loadAmap } from '@/utils/amap-loader';

const props = withDefaults(
  defineProps<{
    latitude: number;
    longitude: number;
    zoom?: number;
  }>(),
  { zoom: 16 },
);

const emit = defineEmits<{
  moveend: [latitude: number, longitude: number];
}>();

/** 容器 id 需唯一，供 AMap.Map 挂载 */
const containerId = `amap-picker-${Date.now()}`;

/** eslint-disable @typescript-eslint/no-explicit-any */
let mapInstance: any = null;
let AMapRef: any = null;
/** 程序性移动地图时不触发 moveend 回调 */
let suppressMoveEnd = false;

/** 地图实例就绪 Promise（定位到当前需等地图初始化完成） */
let resolveMapReady: (() => void) | null = null;
const mapReadyPromise = new Promise<void>((resolve) => {
  resolveMapReady = resolve;
});

/** 等待地图初始化完成 */
function whenReady(): Promise<void> {
  return mapReadyPromise;
}

/** 初始化高德地图：拖动结束后抛出中心点坐标 */
async function initMap() {
  try {
    AMapRef = await loadAmap();
    mapInstance = new AMapRef.Map(containerId, {
      zoom: props.zoom,
      center: [props.longitude, props.latitude],
      viewMode: '2D',
      resizeEnable: true,
    });

    mapInstance.on('moveend', () => {
      if (suppressMoveEnd || !mapInstance) return;
      const center = mapInstance.getCenter();
      emit('moveend', center.lat, center.lng);
    });

    /** 容器尺寸就绪后刷新地图，避免 flex 布局下出现空白 */
    window.setTimeout(() => {
      mapInstance?.resize?.();
    }, 100);

    resolveMapReady?.();
    resolveMapReady = null;
  } catch (err) {
    /** 初始化失败也 resolve，避免定位流程永久等待 */
    resolveMapReady?.();
    resolveMapReady = null;
    const msg = err instanceof Error ? err.message : '地图加载失败';
    uni.showToast({ title: msg, icon: 'none', duration: 3000 });
  }
}

/** 外部调用：移动地图中心到指定坐标（定位到当前） */
function moveTo(longitude: number, latitude: number) {
  if (!mapInstance) return;
  suppressMoveEnd = true;
  mapInstance.setCenter([longitude, latitude]);
  /** 动画结束后恢复 moveend 监听，并同步中心点坐标 */
  window.setTimeout(() => {
    suppressMoveEnd = false;
    const center = mapInstance?.getCenter?.();
    if (center) {
      emit('moveend', center.lat, center.lng);
    }
  }, 350);
}

watch(
  () => [props.latitude, props.longitude] as const,
  ([lat, lng], prev) => {
    if (!mapInstance || !prev) return;
    if (lat === prev[0] && lng === prev[1]) return;
    moveTo(lng, lat);
  },
);

onMounted(() => {
  void initMap();
});

onBeforeUnmount(() => {
  mapInstance?.destroy?.();
  mapInstance = null;
});

defineExpose({ moveTo, whenReady });
</script>

<style lang="scss" scoped>
.location-map-amap-h5 {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
</style>
