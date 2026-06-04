import { Table } from 'antd';
import type { TablePaginationConfig } from 'antd/es/table';
import { useMemo } from 'react';
import type { AppLog, PaginatedResult } from '../../../../api/logs.api';
import { createAppLogColumns, type AppLogColumnHandlers } from './appLogColumns';

export interface AppLogTableProps {
  loading: boolean;
  data: PaginatedResult<AppLog> | null;
  onTableChange: (pagination: TablePaginationConfig) => void;
  columnHandlers: AppLogColumnHandlers;
}

/** 应用错误日志数据表格 */
export default function AppLogTable({
  loading,
  data,
  onTableChange,
  columnHandlers,
}: AppLogTableProps) {
  const columns = useMemo(() => createAppLogColumns(columnHandlers), [columnHandlers]);

  return (
    <Table
      rowKey="id"
      loading={loading}
      columns={columns}
      dataSource={data?.items ?? []}
      scroll={{ x: 800 }}
      pagination={{
        current: data?.page ?? 1,
        pageSize: data?.pageSize ?? 20,
        total: data?.total ?? 0,
        showSizeChanger: true,
        showTotal: (total) => `共 ${total} 条`,
      }}
      onChange={onTableChange}
      locale={{ emptyText: '暂无错误日志' }}
    />
  );
}
