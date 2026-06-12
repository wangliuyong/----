/** 定位相关 uni API 封装（地图展示统一高德，见 manifest sdkConfigs） */
import { wgs84ToGcj02 } from '@/utils/coord-transform';

/** 定位结果（与 uni.getLocation success 对齐的核心字段） */
export interface CurrentPosition {
  latitude: number;
  longitude: number;
}

/**
 * H5：使用浏览器原生 Geolocation，避免 uni.getLocation 走高德 IP 定位导致 IP_LOCATE_FAILED
 * 浏览器返回 WGS84，需转换为 GCJ-02
 */
function getCurrentPositionH5(): Promise<CurrentPosition> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      reject(new Error('当前浏览器不支持定位'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { lng, lat } = wgs84ToGcj02(pos.coords.longitude, pos.coords.latitude);
        resolve({ latitude: lat, longitude: lng });
      },
      (err) => {
        reject(new Error(formatH5GeolocationError(err)));
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 30000,
      },
    );
  });
}

/** 将浏览器 Geolocation 错误码转为用户可读提示 */
function formatH5GeolocationError(err: GeolocationPositionError): string {
  switch (err.code) {
    case err.PERMISSION_DENIED:
      return '请允许浏览器使用位置权限，或在地址栏左侧开启定位';
    case err.POSITION_UNAVAILABLE:
      return '暂时无法获取位置，请拖动地图选点';
    case err.TIMEOUT:
      return '定位超时，请检查网络或拖动地图选点';
    default:
      return '定位失败，请拖动地图选点';
  }
}

/** Promise 化 uni.getLocation（GCJ-02，与高德坐标系一致） */
export function getCurrentPosition(): Promise<CurrentPosition> {
  // #ifdef H5
  return getCurrentPositionH5();
  // #endif

  // #ifndef H5
  return new Promise((resolve, reject) => {
    uni.getLocation({
      type: 'gcj02',
      isHighAccuracy: true,
      success: (res) => resolve({ latitude: res.latitude, longitude: res.longitude }),
      fail: (err) => {
        const msg = String(err?.errMsg || err?.message || '定位失败');
        /** 过滤高德 SDK 原始错误码，给出可操作提示 */
        if (/IP_LOCATE_FAILED|ipLocation/i.test(msg)) {
          reject(new Error('IP 定位失败，请开启 GPS 权限或使用地图选点'));
          return;
        }
        reject(new Error(msg.includes('auth deny') ? '请允许使用位置信息' : '定位失败，请检查权限'));
      },
    });
  });
  // #endif
}

/**
 * 申请定位权限
 * - 微信小程序：uni.authorize + 引导设置
 * - App：引导系统设置
 */
export async function ensureLocationPermission(): Promise<boolean> {
  // #ifdef MP-WEIXIN
  try {
    await new Promise<void>((resolve, reject) => {
      uni.authorize({
        scope: 'scope.userLocation',
        success: () => resolve(),
        fail: reject,
      });
    });
    return true;
  } catch {
    const modal = await new Promise<boolean>((resolve) => {
      uni.showModal({
        title: '需要位置权限',
        content: '请在设置中允许使用位置信息，以便展示同城距离与地图选点',
        confirmText: '去设置',
        success: (res) => resolve(!!res.confirm),
      });
    });
    if (!modal) return false;
    await new Promise<void>((resolve) => {
      uni.openSetting({ complete: () => resolve() });
    });
    return false;
  }
  // #endif

  // #ifdef APP-PLUS
  const setting = uni.getAppAuthorizeSetting?.();
  if (setting?.locationAuthorized === 'denied') {
    const go = await new Promise<boolean>((resolve) => {
      uni.showModal({
        title: '需要位置权限',
        content: '请在系统设置中允许「同城便民」使用位置信息',
        confirmText: '去设置',
        success: (res) => resolve(!!res.confirm),
      });
    });
    if (go) {
      uni.openAppAuthorizeSetting?.({});
    }
    return false;
  }
  return true;
  // #endif

  // #ifndef MP-WEIXIN
  // #ifndef APP-PLUS
  return true;
  // #endif
  // #endif
}
