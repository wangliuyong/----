import { Table } from 'antd';
import { useMemo } from 'react';
import { ADMIN_TABLE_DEFAULTS, mergeAdminTablePagination } from '../../../components/admin-page';
import type { Message } from '../../../types';
import { createMessageColumns, type MessageColumnHandlers } from './messageColumns';

export interface MessageTableProps {
  messages: Message[];
  columnHandlers: MessageColumnHandlers;
}

export default function MessageTable({ messages, columnHandlers }: MessageTableProps) {
  const columns = useMemo(() => createMessageColumns(columnHandlers), [columnHandlers]);

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={messages}
      size={ADMIN_TABLE_DEFAULTS.size}
      className={ADMIN_TABLE_DEFAULTS.className}
      pagination={mergeAdminTablePagination({ total: messages.length })}
      locale={{ emptyText: '暂无留言' }}
    />
  );
}
