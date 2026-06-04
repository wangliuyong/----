import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Space, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { AiChatSessionItem } from '../../../../api/ai.api';
import PermissionGuard from '../../../../components/PermissionGuard';
import { formatSessionTime, shortSessionId } from '../constants';

export interface QaSessionColumnHandlers {
  onView: (id: string) => void;
  onDelete: (id: string) => void;
}

/** 用户问答会话表格列定义 */
export function createQaSessionColumns(
  handlers: QaSessionColumnHandlers,
): ColumnsType<AiChatSessionItem> {
  return [
    {
      title: '会话 ID',
      dataIndex: 'id',
      width: 120,
      render: (id: string) => (
        <Typography.Text copyable={{ text: id }} code>
          {shortSessionId(id)}
        </Typography.Text>
      ),
    },
    {
      title: '最近提问',
      dataIndex: 'lastQuestion',
      ellipsis: true,
      render: (v: string) => v || '-',
    },
    {
      title: '最近回复',
      dataIndex: 'lastReplyPreview',
      ellipsis: true,
      render: (v: string) => v || '-',
    },
    {
      title: '消息数',
      dataIndex: 'messageCount',
      width: 80,
      render: (n: number) => <Tag>{n}</Tag>,
    },
    {
      title: '最近活跃',
      dataIndex: 'updatedAt',
      width: 168,
      render: (v: string) => formatSessionTime(v),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 168,
      render: (v: string) => formatSessionTime(v),
    },
    {
      title: '操作',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handlers.onView(record.id)}
          >
            查看
          </Button>
          <PermissionGuard code="admin:ai-qa:delete">
            <Popconfirm
              title="确定删除该会话？删除后不可恢复。"
              onConfirm={() => handlers.onDelete(record.id)}
            >
              <Button type="link" size="small" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </PermissionGuard>
        </Space>
      ),
    },
  ];
}
