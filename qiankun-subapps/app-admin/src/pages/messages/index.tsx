import { DeleteOutlined } from '@ant-design/icons';
import { Button, Card, Popconfirm, Table, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import PageError from '../../components/_common/PageError';
import PageLoading from '../../components/_common/PageLoading';
import { useApiBase } from '../../context/ApiBaseContext';
import { adminApi } from '../../utils/adminApi';
import type { Message } from '../../types';
import { useMessages } from './useMessages';

/** 路由 /messages — 留言列表（只读 + 删除） */
export default function MessagesPage() {
  const apiBase = useApiBase();
  const { messages, loading, error, reload } = useMessages();

  if (loading) return <PageLoading />;
  if (error) return <PageError message={error} />;

  const handleDelete = async (id: number) => {
    await adminApi.deleteMessage(apiBase, id);
    message.success('已删除');
    reload();
  };

  const columns: ColumnsType<Message> = [
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
        <Popconfirm title="确定删除该留言？" onConfirm={() => handleDelete(record.id)}>
          <Button type="link" size="small" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  return (
    <Card title="留言管理">
      <Table
        rowKey="id"
        columns={columns}
        dataSource={messages}
        pagination={{ pageSize: 10 }}
        locale={{ emptyText: '暂无留言' }}
      />
    </Card>
  );
}
