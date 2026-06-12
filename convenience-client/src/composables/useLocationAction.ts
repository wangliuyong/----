import { useLocationStore } from '@/stores/location';

/**
 * 首页 / 发布页共用的定位交互
 * 选点或重新定位后可选回调刷新列表
 */
export function useLocationAction(onUpdated?: () => void) {
  const locationStore = useLocationStore();

  /** 打开定位操作菜单，位置变更后触发 onUpdated */
  async function openLocationPicker() {
    const result = await locationStore.openLocationAction();
    if (result !== 'cancelled') {
      onUpdated?.();
    }
    return result;
  }

  return {
    locationStore,
    openLocationPicker,
  };
}
