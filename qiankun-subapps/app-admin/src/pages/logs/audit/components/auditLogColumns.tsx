import { EyeOutlined } from '@ant-design/icons';
import { Button, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { AuditLog } from '../../../../api/logs.api';
import { ACTION_COLORS, ACTION_LABELS } from '../constants';

export interface AuditLogColumnHandlers {
  onViewDetail: (record: AuditLog) => void;
}

/** 审计日志表格列 */
export function createAuditLogColumns(
  handlers: AuditLogColumnHandlers,
): ColumnsType<AuditLog> {
  return [
    {
      title: '操作',
      dataIndex: 'action',
      width: 90,
      render: (action: string) => (
        <Tag color={ACTION_COLORS[action] ?? 'default'}>
          {ACTION_LABELS[action] ?? action}
        </Tag>
      ),
    },
    { title: '操作人', dataIndex: 'username', width: 120, render: (v) => v || '-' },
    { title: '模块', dataIndex: 'module', width: 160, ellipsis: true, render: (v) => v || '-' },
    { title: '目标 ID', dataIndex: 'targetId', width: 100, render: (v) => v || '-' },
    { title: 'IP', dataIndex: 'ip', width: 140, render: (v) => v || '-' },
    {
      title: '时间',
      dataIndex: 'createdAt',
      width: 170,
      render: (v: string) => new Date(v).toLocaleString(),
    },
    {
      title: '详情',
      width: 80,
      fixed: 'right',
      render: (_, record) => (
        <Button
          type="link"
          size="small"
          icon={<EyeOutlined />}
          disabled={!record.detail}
          onClick={() => handlers.onViewDetail(record)}
        >
          查看
        </Button>
      ),
    },
  ];
}
