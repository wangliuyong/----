import { Table } from 'antd';
import type { TablePaginationConfig } from 'antd/es/table';
import { useMemo } from 'react';
import type { AiChatSessionItem, PaginatedAiChatSessions } from '../../../../api/ai.api';
import { createQaSessionColumns, type QaSessionColumnHandlers } from './qaSessionColumns';

export interface QaSessionTableProps {
  loading: boolean;
  data: PaginatedAiChatSessions | null;
  canDelete: boolean;
  selectedRowKeys: string[];
  onSelectionChange: (keys: string[]) => void;
  onTableChange: (pagination: TablePaginationConfig) => void;
  columnHandlers: QaSessionColumnHandlers;
}

/** 用户问答会话列表表格 */
export default function QaSessionTable({
  loading,
  data,
  canDelete,
  selectedRowKeys,
  onSelectionChange,
  onTableChange,
  columnHandlers,
}: QaSessionTableProps) {
  const columns = useMemo(
    () => createQaSessionColumns(columnHandlers),
    [columnHandlers],
  );

  return (
    <Table<AiChatSessionItem>
      rowKey="id"
      loading={loading}
      columns={columns}
      dataSource={data?.items ?? []}
      scroll={{ x: 960 }}
      rowSelection={
        canDelete
          ? {
              selectedRowKeys,
              onChange: (keys) => onSelectionChange(keys as string[]),
            }
          : undefined
      }
      pagination={{
        current: data?.page ?? 1,
        pageSize: data?.pageSize ?? 20,
        total: data?.total ?? 0,
        showSizeChanger: true,
        showTotal: (total) => `共 ${total} 条`,
      }}
      onChange={onTableChange}
      locale={{ emptyText: '暂无用户问答记录' }}
    />
  );
}
