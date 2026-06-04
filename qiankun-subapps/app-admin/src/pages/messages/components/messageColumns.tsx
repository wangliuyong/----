import { DeleteOutlined } from '@ant-design/icons';
import { Button, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import PermissionGuard from '../../../components/PermissionGuard';
import type { Message } from '../../../types';

export interface MessageColumnHandlers {
  onDelete: (id: number) => void;
}

export function createMessageColumns(handlers: MessageColumnHandlers): ColumnsType<Message> {
  return [
    { title: '昵称', dataIndex: 'nickname', width: 120 },
    { title: '联系方式', dataIndex: 'contact', width: 160 },
    { title: '留言内容', dataIndex: 'content', ellipsis: true },
    {
      title: '时间',
      dataIndex: 'createdAt',
      width: 170,
      render: (v: string) => new Date(v).toLocaleString(),
    },
    {
      title: '操作',
      width: 80,
      render: (_, record) => (
        <PermissionGuard code="admin:messages:delete">
          <Popconfirm title="确定删除该留言？" onConfirm={() => handlers.onDelete(record.id)}>
            <Button type="link" size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </PermissionGuard>
      ),
    },
  ];
}
