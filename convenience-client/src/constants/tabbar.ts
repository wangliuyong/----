/**
 * 底部 Tab 配置（uview-plus u-tabbar-item 图标）
 * inactiveIcon / activeIcon 均为 uview 内置图标名
 */
export interface TabBarItemConfig {
  /** 与 u-tabbar value 匹配的标识 */
  name: number;
  /** uni-app 页面路径（不含前导 /） */
  pagePath: string;
  text: string;
  inactiveIcon: string;
  activeIcon: string;
  /** 中间凸起发布按钮 */
  midButton?: boolean;
}

/** 未选中 / 选中色，与 tokens v3 钴蓝体系一致 */
export const TAB_BAR_ACTIVE_COLOR = '#1d4ed8';
export const TAB_BAR_INACTIVE_COLOR = '#8b9bb8';
export const TAB_BAR_BG = 'rgba(255, 255, 255, 0.92)';

export const TAB_BAR_ITEMS: TabBarItemConfig[] = [
  {
    name: 0,
    pagePath: 'pages/home/index',
    text: '首页',
    inactiveIcon: 'home',
    activeIcon: 'home-fill',
  },
  {
    name: 1,
    pagePath: 'pages/category/index',
    text: '分类',
    inactiveIcon: 'grid',
    activeIcon: 'grid-fill',
  },
  {
    name: 2,
    pagePath: 'pages/publish/index',
    text: '发布',
    inactiveIcon: 'plus',
    activeIcon: 'plus',
    midButton: true,
  },
  {
    name: 3,
    pagePath: 'pages/ai/index',
    text: 'AI',
    inactiveIcon: 'chat',
    activeIcon: 'chat-fill',
  },
  {
    name: 4,
    pagePath: 'pages/mine/index',
    text: '我的',
    inactiveIcon: 'account',
    activeIcon: 'account-fill',
  },
];

/** AI Tab 页路径（不含前导 /） */
export const AI_PAGE_PATH = 'pages/ai/index';

/** @deprecated 使用 AI_PAGE_PATH */
export const AI_TAB_PAGE_PATH = AI_PAGE_PATH;

/** 判断 URL 是否指向 TabBar 页面 */
export function isTabBarPath(url: string): boolean {
  const path = url.replace(/^\//, '').split('?')[0];
  return TAB_BAR_ITEMS.some((item) => item.pagePath === path);
}
