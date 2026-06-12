import { defineStore } from 'pinia';
import { queryReverseGeocode, extractCityFromMapResult } from '@/utils/geocode';
import { ensureLocationPermission, getCurrentPosition } from '@/utils/location';
import { formatRegionFull, formatRegionLabel } from '@/utils/region-label';
import { isApp, isH5, isMpWeixin } from '@/utils/platform';

const STORAGE_KEY = 'conv_location';

interface LocationState {
  /** 省（首页省市区选择） */
  province: string;
  /** 市 */
  city: string;
  /** 区 */
  district: string;
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
  province?: string;
  city?: string;
  district?: string;
  cityName: string;
  address: string;
  latitude: number;
  longitude: number;
}

/** 用户定位 Store（首页省市区 + 其他页 GPS/地图选点） */
export const useLocationStore = defineStore('location', {
  state: (): LocationState => ({
    province: '上海市',
    city: '上海市',
    district: '黄浦区',
    cityName: '上海',
    address: '上海市上海市黄浦区',
    latitude: 31.2304,
    longitude: 121.4737,
    locating: false,
  }),

  getters: {
    /** 首页 region picker 绑定值 [省, 市, 区] */
    regionCodes(state): [string, string, string] {
      return [state.province, state.city, state.district];
    },
  },

  actions: {
    /** 从本地缓存恢复上次选中的位置 */
    restoreFromStorage() {
      try {
        const raw = uni.getStorageSync(STORAGE_KEY) as string;
        if (!raw) return;
        const data = JSON.parse(raw) as StoredLocation;
        if (data.province && data.city) {
          this.province = data.province;
          this.city = data.city;
          this.district = data.district || '';
          this.cityName = data.cityName || formatRegionLabel(data.province, data.city, data.district);
          this.address = data.address || formatRegionFull(data.province, data.city, data.district);
        }
        if (typeof data.latitude === 'number' && typeof data.longitude === 'number') {
          this.latitude = data.latitude;
          this.longitude = data.longitude;
        }
        if (!data.province && data.cityName) {
          this.cityName = data.cityName;
          this.address = data.address || '';
        }
      } catch {
        // 缓存损坏时忽略
      }
    },

    /** 首页：应用省市区选择结果 */
    applyRegion(province: string, city: string, district = '') {
      this.province = province;
      this.city = city;
      this.district = district;
      this.cityName = formatRegionLabel(province, city, district);
      this.address = formatRegionFull(province, city, district);
      this.persist();
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
        province: this.province,
        city: this.city,
        district: this.district,
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

    /** 各端统一：打开地图选点（微信小程序用原生选点，避免开发者工具 map 瓦片空白） */
    async chooseOnMap(): Promise<boolean> {
      // #ifdef MP-WEIXIN
      return this.chooseByNativePicker();
      // #endif
      return this.openMapPickerPage();
    },

    /** 微信小程序 / 系统原生地图选点 */
    chooseByNativePicker(): Promise<boolean> {
      return new Promise((resolve) => {
        uni.chooseLocation({
          success: (res) => {
            this.applyLocation({
              latitude: res.latitude,
              longitude: res.longitude,
              cityName: extractCityFromMapResult(res.name, res.address),
              address: res.address || res.name || '',
            });
            resolve(true);
          },
          fail: () => resolve(false),
        });
      });
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
