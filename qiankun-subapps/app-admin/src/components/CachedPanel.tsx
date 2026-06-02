import type { ReactNode } from 'react';
import type { AdminTab } from '../types';

interface CachedPanelProps {
  /** 本面板对应的 Tab */
  tab: AdminTab;
  /** 当前激活 Tab */
  activeTab: AdminTab;
  /** 已访问过的 Tab（首次访问后保持挂载以缓存表单/列表状态） */
  visited: Set<AdminTab>;
  children: ReactNode;
}

/**
 * 路由级页面缓存：访问过的 Tab 不卸载，仅隐藏
 * 切换侧栏时保留 Ant Design 表单、表格分页等本地状态
 */
export default function CachedPanel({
  tab,
  activeTab,
  visited,
  children,
}: CachedPanelProps) {
  if (!visited.has(tab)) return null;

  const active = tab === activeTab;

  return (
    <div
      role="tabpanel"
      aria-hidden={!active}
      hidden={!active}
      style={{ display: active ? 'block' : 'none' }}
    >
      {children}
    </div>
  );
}
