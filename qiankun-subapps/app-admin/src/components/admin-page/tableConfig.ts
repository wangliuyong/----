import type { TableProps } from 'antd';

/**
 * 后台列表页 Table 默认配置：统一分页文案、尺寸与样式类名
 */
export const ADMIN_TABLE_DEFAULTS = {
  size: 'middle',
  className: 'admin-data-table',
  pagination: {
    pageSize: 10,
    showSizeChanger: true,
    showTotal: (total: number) => `共 ${total} 条`,
    pageSizeOptions: ['10', '20', '50', '100'],
  },
} as const satisfies Partial<TableProps>;

/** 合并分页配置（保留调用方 current / total 等） */
export function mergeAdminTablePagination(
  overrides?: TableProps['pagination'],
): TableProps['pagination'] {
  if (overrides === false) return false;
  return {
    ...ADMIN_TABLE_DEFAULTS.pagination,
    ...(overrides && typeof overrides === 'object' ? overrides : {}),
  };
}
