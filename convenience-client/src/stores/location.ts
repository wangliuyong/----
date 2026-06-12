import { defineStore } from 'pinia';

interface LocationState {
  /** 城市名称（H5 降级展示） */
  cityName: string;
  latitude: number;
  longitude: number;
}

/** 用户定位 Store（默认上海坐标，获取失败时保留） */
export const useLocationStore = defineStore('location', {
  state: (): LocationState => ({
    cityName: '本地同城',
    latitude: 31.2304,
    longitude: 121.4737,
  }),

  actions: {
    /** 尝试获取真实定位，失败则保留默认坐标 */
    async fetchLocation() {
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
