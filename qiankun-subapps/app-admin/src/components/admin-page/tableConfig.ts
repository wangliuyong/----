import type { UiTablePagination } from '../components/ui';

/**
 * 后台列表页 Table 默认配置
 */
export const ADMIN_TABLE_DEFAULTS = {
  className: 'admin-data-table',
  pagination: {
    pageSize: 10,
    showSizeChanger: true,
    showTotal: (total: number) => `共 ${total} 条`,
    pageSizeOptions: ['10', '20', '50', '100'],
  },
} as const;

/** 合并分页配置 */
export function mergeAdminTablePagination(
  overrides?: Partial<UiTablePagination> | false,
): UiTablePagination | false {
  if (overrides === false) return false;
  return {
    ...ADMIN_TABLE_DEFAULTS.pagination,
    ...(overrides && typeof overrides === 'object' ? overrides : {}),
  };
}
