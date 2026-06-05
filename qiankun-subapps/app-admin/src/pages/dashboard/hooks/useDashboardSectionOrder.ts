import { useCallback, useState } from 'react';
import { getUsername } from '../../../utils/auth';
import {
  DEFAULT_SECTION_ORDER,
  type DashboardSectionId,
} from '../config/sectionTypes';

const STORAGE_PREFIX = 'admin-dashboard-section-order-v1';

function getStorageKey(): string {
  return `${STORAGE_PREFIX}-${getUsername() ?? 'anonymous'}`;
}

const VALID_IDS = new Set<string>(DEFAULT_SECTION_ORDER);

/** 读取并校验 localStorage 中的区块顺序 */
function loadSectionOrder(): DashboardSectionId[] {
  try {
    const raw = localStorage.getItem(getStorageKey());
    if (!raw) return [...DEFAULT_SECTION_ORDER];

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [...DEFAULT_SECTION_ORDER];

    const filtered = parsed.filter(
      (id): id is DashboardSectionId => typeof id === 'string' && VALID_IDS.has(id),
    );
    const missing = DEFAULT_SECTION_ORDER.filter((id) => !filtered.includes(id));

    return filtered.length > 0 ? [...filtered, ...missing] : [...DEFAULT_SECTION_ORDER];
  } catch {
    return [...DEFAULT_SECTION_ORDER];
  }
}

function persistSectionOrder(order: DashboardSectionId[]) {
  localStorage.setItem(getStorageKey(), JSON.stringify(order));
}

/** 管理首页卡片区块顺序（localStorage 按用户隔离） */
export function useDashboardSectionOrder() {
  const [order, setOrder] = useState<DashboardSectionId[]>(() => loadSectionOrder());
  const [isEditing, setIsEditing] = useState(false);

  const reorder = useCallback((next: DashboardSectionId[]) => {
    setOrder(next);
    persistSectionOrder(next);
  }, []);

  const resetOrder = useCallback(() => {
    const next = [...DEFAULT_SECTION_ORDER];
    setOrder(next);
    persistSectionOrder(next);
  }, []);

  return {
    order,
    isEditing,
    setIsEditing,
    reorder,
    resetOrder,
  };
}
