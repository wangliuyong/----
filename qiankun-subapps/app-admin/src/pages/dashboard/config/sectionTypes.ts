/** 首页可排序卡片区块 id */
export type DashboardSectionId =
  | 'stats'
  | 'charts'
  | 'visits'
  | 'panels'
  | 'quickLinks'
  | 'recent';

/** 区块显示名称（编辑模式提示用） */
export const SECTION_LABELS: Record<DashboardSectionId, string> = {
  stats: '核心指标',
  charts: '趋势图表',
  visits: '访问记录',
  panels: '互动概览 / 服务器',
  quickLinks: '快捷入口',
  recent: '最近动态',
};

/** 出厂默认排序（与原先固定布局一致） */
export const DEFAULT_SECTION_ORDER: DashboardSectionId[] = [
  'stats',
  'charts',
  'visits',
  'panels',
  'quickLinks',
  'recent',
];
