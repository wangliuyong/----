import { Table } from 'antd';
import type { TablePaginationConfig } from 'antd/es/table';
import { useMemo } from 'react';
import { ADMIN_TABLE_DEFAULTS, mergeAdminTablePagination } from '../../../../components/admin-page';
import type { ConvReportItem } from '../../../../types/convenience';
import { REPORT_EMPTY_HINT } from '../constants';
import { createReportColumns, type ReportColumnHandlers } from './reportColumns';

export interface ReportTableProps {
  loading: boolean;
  list: ConvReportItem[];
  total: number;
  page: number;
  pageSize: number;
  onTableChange: (page: number, pageSize: number) => void;
  columnHandlers: ReportColumnHandlers;
}

/** 举报记录数据表格 */
export default function ReportTable({
  loading,
  list,
  total,
  page,
  pageSize,
  onTableChange,
  columnHandlers,
}: ReportTableProps) {
  const columns = useMemo(() => createReportColumns(columnHandlers), [columnHandlers]);

  const handleChange = (pagination: TablePaginationConfig) => {
    onTableChange(pagination.current ?? 1, pagination.pageSize ?? pageSize);
  };

  return (
    <Table<ConvReportItem>
      rowKey="id"
      loading={loading}
      columns={columns}
      dataSource={list}
      size={ADMIN_TABLE_DEFAULTS.size}
      className={ADMIN_TABLE_DEFAULTS.className}
      scroll={{ x: 1100 }}
      pagination={mergeAdminTablePagination({ current: page, pageSize, total })}
      onChange={handleChange}
      locale={{ emptyText: REPORT_EMPTY_HINT }}
    />
  );
}
