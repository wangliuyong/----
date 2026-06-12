import { defineStore } from 'pinia';
import { queryReverseGeocode } from '@/utils/geocode';
import { ensureLocationPermission, getCurrentPosition } from '@/utils/location';
import { isApp, isH5, isMpWeixin } from '@/utils/platform';

const STORAGE_KEY = 'conv_location';

interface LocationState {
  /** 城市名称（首页展示） */
  cityName: string;
  /** 详细地址 */
  address: string;
  latitude: number;
  longitude: number;
  /** 是否正在定位 */
  locating: boolean;
}

interface StoredLocation {
  cityName: string;
  address: string;
  latitude: number;
  longitude: number;
}

/** 用户定位 Store（高德地图统一：GPS + 地图选点页） */
export const useLocationStore = defineStore('location', {
  state: (): LocationState => ({
    cityName: '本地同城',
    address: '',
    latitude: 31.2304,
    longitude: 121.4737,
    locating: false,
  }),

  actions: {
    /** 从本地缓存恢复上次选中的位置 */
    restoreFromStorage() {
      try {
        const raw = uni.getStorageSync(STORAGE_KEY) as string;
        if (!raw) return;
        const data = JSON.parse(raw) as StoredLocation;
        if (typeof data.latitude === 'number' && typeof data.longitude === 'number') {
          this.cityName = data.cityName || this.cityName;
          this.address = data.address || '';
          this.latitude = data.latitude;
          this.longitude = data.longitude;
        }
      } catch {
        // 缓存损坏时忽略
      }
    },

    /** 写入位置并持久化 */
    applyLocation(payload: Partial<StoredLocation>) {
      if (payload.cityName) this.cityName = payload.cityName;
      if (payload.address !== undefined) this.address = payload.address;
      if (typeof payload.latitude === 'number') this.latitude = payload.latitude;
      if (typeof payload.longitude === 'number') this.longitude = payload.longitude;
      this.persist();
    },

    persist() {
      const data: StoredLocation = {
        cityName: this.cityName,
        address: this.address,
        latitude: this.latitude,
        longitude: this.longitude,
      };
      uni.setStorageSync(STORAGE_KEY, JSON.stringify(data));
    },

    /**
     * GPS 重新定位：获取当前坐标 + 高德逆地理编码
     * @param showToast 失败时是否提示
     */
    async fetchLocation(showToast = false): Promise<boolean> {
      if (this.locating) return false;
      this.locating = true;

      try {
        if (isMpWeixin() || isApp()) {
          const granted = await ensureLocationPermission();
          if (!granted) {
            if (showToast) {
              uni.showToast({ title: '未获得定位权限', icon: 'none' });
            }
            return false;
          }
        }

        const pos = await Promise.race([
          getCurrentPosition(),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('定位超时')), 10000),
          ),
        ]);

        let cityName = this.cityName;
        let address = this.address;

        try {
          const geo = await queryReverseGeocode(pos.latitude, pos.longitude);
          cityName = geo.cityName;
          address = geo.address;
        } catch {
          if (showToast) {
            uni.showToast({ title: '已获取坐标，地址解析失败', icon: 'none' });
          }
        }

        this.applyLocation({
          latitude: pos.latitude,
          longitude: pos.longitude,
          cityName,
          address,
        });

        if (showToast) {
          uni.showToast({ title: `已定位到${cityName}`, icon: 'none' });
        }
        return true;
      } catch {
        const msg = isH5()
          ? '定位失败，请允许浏览器位置权限或使用地图选点'
          : '定位失败，请检查权限或使用地图选点';
        if (showToast) {
          uni.showToast({ title: msg, icon: 'none' });
        }
        return false;
      } finally {
        this.locating = false;
      }
    },

    /** 各端统一：打开高德地图选点页（H5 / App / 小程序） */
    async chooseOnMap(): Promise<boolean> {
      return this.openMapPickerPage();
    },

    /** 打开地图选点页，选点结果经 eventChannel 回传 */
    openMapPickerPage(): Promise<boolean> {
      return new Promise((resolve) => {
        uni.navigateTo({
          url: '/pages/location/picker',
          events: {
            acceptLocation: (data: StoredLocation) => {
              this.applyLocation(data);
              resolve(true);
            },
          },
          fail: () => {
            uni.showToast({ title: '无法打开地图页', icon: 'none' });
            resolve(false);
          },
        });
      });
    },

    /**
     * 弹出定位操作菜单：地图选点 / 重新定位
     * @returns picked | relocated | cancelled
     */
    async openLocationAction(): Promise<'picked' | 'relocated' | 'cancelled'> {
      const index = await new Promise<number>((resolve) => {
        uni.showActionSheet({
          itemList: ['地图选点', '重新定位'],
          success: (res) => resolve(res.tapIndex),
          fail: () => resolve(-1),
        });
      });

      if (index === 0) {
        const ok = await this.chooseOnMap();
        return ok ? 'picked' : 'cancelled';
      }
      if (index === 1) {
        const ok = await this.fetchLocation(true);
        return ok ? 'relocated' : 'cancelled';
      }
      return 'cancelled';
    },
  },
});
