import { Table } from 'antd';
import { useMemo } from 'react';
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
      pagination={{ pageSize: 10 }}
      locale={{ emptyText: '暂无留言' }}
    />
  );
}
