import { onShow } from '@dcloudio/uni-app';
import { useTabBarStore } from '@/stores/tabbar';

/**
 * Tab 页生命周期：每次展示时同步底部导航高亮
 */
export function useTabBarPage() {
  const tabBarStore = useTabBarStore();

  onShow(() => {
    tabBarStore.syncFromRoute();
  });
}
