import type { ReactNode } from 'react';

/** 页面统计卡片单项配置 */
export interface AdminStatItem {
  /** 指标标签 */
  label: string;
  /** 展示数值 */
  value: number | string;
  /** 可选图标 */
  icon?: ReactNode;
  /** 数值强调色（如待办告警） */
  accent?: 'default' | 'warning' | 'success' | 'danger' | 'primary';
  /** 辅助说明 */
  hint?: string;
}

/** AdminPageShell 公共属性 */
export interface AdminPageShellProps {
  /** 页面主标题 */
  title: string;
  /** 副标题 / 功能说明 */
  description?: string;
  /** 顶栏右侧操作区（新建、刷新等） */
  extra?: ReactNode;
  /** 概览统计卡片 */
  stats?: AdminStatItem[];
  children: ReactNode;
  /** 根节点额外 class */
  className?: string;
}
