/** 定位相关 uni API 封装（地图展示统一高德，见 manifest sdkConfigs） */

/** Promise 化 uni.getLocation（GCJ-02，与高德坐标系一致） */
export function getCurrentPosition(): Promise<UniApp.GetLocationSuccess> {
  return new Promise((resolve, reject) => {
    uni.getLocation({
      type: 'gcj02',
      isHighAccuracy: true,
      success: resolve,
      fail: reject,
    });
  });
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
