import { EyeOutlined } from '@ant-design/icons';
import { Button, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { AppLog } from '../../../../api/logs.api';
import { LEVEL_COLORS } from '../constants';

export interface AppLogColumnHandlers {
  onViewDetail: (record: AppLog) => void;
}

/** 应用错误日志表格列 */
export function createAppLogColumns(handlers: AppLogColumnHandlers): ColumnsType<AppLog> {
  return [
    {
      title: '级别',
      dataIndex: 'level',
      width: 90,
      render: (level: string) => (
        <Tag color={LEVEL_COLORS[level] ?? 'default'}>{level.toUpperCase()}</Tag>
      ),
    },
    { title: '上下文', dataIndex: 'context', width: 140, ellipsis: true, render: (v) => v || '-' },
    { title: '消息', dataIndex: 'message', ellipsis: true },
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
          onClick={() => handlers.onViewDetail(record)}
        >
          查看
        </Button>
      ),
    },
  ];
}
