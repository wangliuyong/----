import { Table } from 'antd';
import type { TablePaginationConfig } from 'antd/es/table';
import { useMemo } from 'react';
import type { AuditLog, PaginatedResult } from '../../../../api/logs.api';
import { createAuditLogColumns, type AuditLogColumnHandlers } from './auditLogColumns';

export interface AuditLogTableProps {
  loading: boolean;
  data: PaginatedResult<AuditLog> | null;
  onTableChange: (pagination: TablePaginationConfig) => void;
  columnHandlers: AuditLogColumnHandlers;
}

/** 审计日志数据表格 */
export default function AuditLogTable({
  loading,
  data,
  onTableChange,
  columnHandlers,
}: AuditLogTableProps) {
  const columns = useMemo(() => createAuditLogColumns(columnHandlers), [columnHandlers]);

  return (
    <Table
      rowKey="id"
      loading={loading}
      columns={columns}
      dataSource={data?.items ?? []}
      scroll={{ x: 900 }}
      pagination={{
        current: data?.page ?? 1,
        pageSize: data?.pageSize ?? 20,
        total: data?.total ?? 0,
        showSizeChanger: true,
        showTotal: (total) => `共 ${total} 条`,
      }}
      onChange={onTableChange}
      locale={{ emptyText: '暂无审计日志' }}
    />
  );
}
