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
  /** 中间凸起发布按钮（独立子页，非 switchTab） */
  midButton?: boolean;
  /** 是否使用 uni.switchTab 切换（false 则走 navigateTo） */
  switchTab?: boolean;
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
    switchTab: true,
  },
  {
    name: 1,
    pagePath: 'pages/category/index',
    text: '分类',
    inactiveIcon: 'grid',
    activeIcon: 'grid-fill',
    switchTab: true,
  },
  {
    name: 2,
    pagePath: 'pages/publish/index',
    text: '发布',
    inactiveIcon: 'plus',
    activeIcon: 'plus',
    midButton: true,
    switchTab: false,
  },
  {
    name: 3,
    pagePath: 'pages/ai/index',
    text: 'AI',
    inactiveIcon: 'chat',
    activeIcon: 'chat-fill',
    switchTab: true,
  },
  {
    name: 4,
    pagePath: 'pages/mine/index',
    text: '我的',
    inactiveIcon: 'account',
    activeIcon: 'account-fill',
    switchTab: true,
  },
];

/** AI Tab 页路径（不含前导 /） */
export const AI_PAGE_PATH = 'pages/ai/index';

/** 发布页路径（独立子页，不在 pages.json tabBar.list 中） */
export const PUBLISH_PAGE_PATH = 'pages/publish/index';

/**
 * 使用 switchTab 切换的 Tab 页（不含发布）
 * 与 pages.json tabBar.list 保持一致
 */
export const TAB_SWITCH_PATHS = [
  'pages/home/index',
  'pages/category/index',
  'pages/ai/index',
  'pages/mine/index',
] as const;

/** 沉浸式 Tab 页：switchTab 页面内隐藏自定义 TabBar */
export const TAB_BAR_HIDDEN_PATHS = [AI_PAGE_PATH] as const;

/** 规范化路由（去前导斜杠） */
export function normalizeRoute(route: string): string {
  return route.replace(/^\//, '');
}

/** 当前路由是否应隐藏 TabBar */
export function isTabBarHiddenPath(route: string): boolean {
  return (TAB_BAR_HIDDEN_PATHS as readonly string[]).includes(normalizeRoute(route));
}

/** 当前路由是否为 switchTab Tab 页 */
export function isTabSwitchPath(route: string): boolean {
  return (TAB_SWITCH_PATHS as readonly string[]).includes(normalizeRoute(route));
}

/** 打开发布页（独立子页） */
export function openPublishPage(query?: { categoryId?: number }) {
  const qs = query?.categoryId ? `?categoryId=${query.categoryId}` : '';
  uni.navigateTo({ url: `/${PUBLISH_PAGE_PATH}${qs}` });
}

/** @deprecated 使用 AI_PAGE_PATH */
export const AI_TAB_PAGE_PATH = AI_PAGE_PATH;

/** 判断 URL 是否指向 switchTab Tab 页（发布页返回 false） */
export function isTabBarPath(url: string): boolean {
  const path = url.replace(/^\//, '').split('?')[0];
  return (TAB_SWITCH_PATHS as readonly string[]).includes(path);
}
