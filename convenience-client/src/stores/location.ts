import { defineStore } from 'pinia';
import { useMock } from '@/utils/platform';

interface LocationState {
  /** 城市名称（H5 降级展示） */
  cityName: string;
  latitude: number;
  longitude: number;
}

/** 用户定位 Store（Mock 默认市中心坐标） */
export const useLocationStore = defineStore('location', {
  state: (): LocationState => ({
    cityName: '本地同城',
    latitude: 31.2304,
    longitude: 121.4737,
  }),

  actions: {
    /** 尝试获取真实定位，失败则保留 Mock 坐标 */
    async fetchLocation() {
      // Mock 模式直接使用默认坐标，避免 H5 定位 API 长时间阻塞页面
      if (useMock()) return;

      try {
        const res = await Promise.race([
          new Promise<UniApp.GetLocationSuccess>((resolve, reject) => {
            uni.getLocation({
              type: 'gcj02',
              success: resolve,
              fail: reject,
            });
          }),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('定位超时')), 3000),
          ),
        ]);
        this.latitude = res.latitude;
        this.longitude = res.longitude;
      } catch {
        // H5/未授权/超时时保持默认坐标
      }
    },

    setCityName(name: string) {
      this.cityName = name;
    },
  },
});
