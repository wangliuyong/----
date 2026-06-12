import { Table } from 'antd';
import type { TablePaginationConfig } from 'antd/es/table';
import { useMemo } from 'react';
import { ADMIN_TABLE_DEFAULTS, mergeAdminTablePagination } from '../../../../components/admin-page';
import type { KnowledgeChunkItem, PaginatedKnowledgeChunks } from '../../../../api/ai.api';
import { createKnowledgeChunkColumns, type KnowledgeChunkColumnHandlers } from './knowledgeChunkColumns';

export interface KnowledgeChunkTableProps {
  loading: boolean;
  data: PaginatedKnowledgeChunks | null;
  canDelete: boolean;
  selectedRowKeys: string[];
  onSelectionChange: (keys: string[]) => void;
  onTableChange: (pagination: TablePaginationConfig) => void;
  columnHandlers: KnowledgeChunkColumnHandlers;
}

/** 知识库向量块列表表格 */
export default function KnowledgeChunkTable({
  loading,
  data,
  canDelete,
  selectedRowKeys,
  onSelectionChange,
  onTableChange,
  columnHandlers,
}: KnowledgeChunkTableProps) {
  const columns = useMemo(
    () => createKnowledgeChunkColumns(columnHandlers),
    [columnHandlers],
  );

  return (
    <Table<KnowledgeChunkItem>
      rowKey="id"
      loading={loading}
      columns={columns}
      dataSource={data?.items ?? []}
      size={ADMIN_TABLE_DEFAULTS.size}
      className={ADMIN_TABLE_DEFAULTS.className}
      scroll={{ x: 960 }}
      rowSelection={
        canDelete
          ? {
              selectedRowKeys,
              onChange: (keys) => onSelectionChange(keys as string[]),
            }
          : undefined
      }
      pagination={mergeAdminTablePagination({
        current: data?.page ?? 1,
        pageSize: data?.pageSize ?? 20,
        total: data?.total ?? 0,
      })}
      onChange={onTableChange}
      locale={{ emptyText: '暂无向量数据，请先在「数据配置管理」中同步数据源' }}
    />
  );
}
