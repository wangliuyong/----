import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Space, Tag, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import PermissionGuard from '../../../../components/PermissionGuard';
import type { ConvReportItem } from '../../../../types/convenience';
import { INFO_AUDIT_STATUS_MAP, REPORT_TYPE_CONFIG, type ReportTypeKey } from '../constants';

export interface ReportColumnHandlers {
  onViewDetail: (record: ConvReportItem) => void;
  onDelete: (id: number) => void;
}

/** 举报管理表格列定义 */
export function createReportColumns(handlers: ReportColumnHandlers): ColumnsType<ConvReportItem> {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 72,
      fixed: 'left',
    },
    {
      title: '举报人',
      dataIndex: 'userNickname',
      width: 110,
      render: (name: string, record) => (
        <Tooltip title={`用户 ID: ${record.userId}`}>
          <span>{name || `用户#${record.userId}`}</span>
        </Tooltip>
      ),
    },
    {
      title: '被举报信息',
      dataIndex: 'infoTitle',
      ellipsis: true,
      render: (title: string, record) => (
        <Tooltip title={`信息 ID: ${record.infoId}`}>
          <span className="report-cell-info-title">{title}</span>
        </Tooltip>
      ),
    },
    {
      title: '信息状态',
      dataIndex: 'infoAuditStatus',
      width: 96,
      render: (v: keyof typeof INFO_AUDIT_STATUS_MAP) => {
        const cfg = INFO_AUDIT_STATUS_MAP[v];
        return cfg ? <Tag color={cfg.color}>{cfg.label}</Tag> : <Tag>{v}</Tag>;
      },
    },
    {
      title: '举报类型',
      dataIndex: 'reportType',
      width: 100,
      render: (v: ReportTypeKey) => {
        const cfg = REPORT_TYPE_CONFIG[v];
        return cfg ? (
          <Tooltip title={cfg.description}>
            <Tag color={cfg.color} icon={cfg.icon}>
              {cfg.label}
            </Tag>
          </Tooltip>
        ) : (
          <Tag>{v}</Tag>
        );
      },
    },
    {
      title: '举报说明',
      dataIndex: 'content',
      ellipsis: true,
      render: (text: string) =>
        text ? (
          <Tooltip title={text}>
            <span className="report-cell-content">{text}</span>
          </Tooltip>
        ) : (
          <span className="report-cell-content report-cell-content--muted">未填写说明</span>
        ),
    },
    {
      title: '举报时间',
      dataIndex: 'createdAt',
      width: 168,
      render: (v: string) => (
        <Tooltip title={dayjs(v).format('YYYY-MM-DD HH:mm:ss')}>
          <span className="report-cell-time">{dayjs(v).format('MM-DD HH:mm')}</span>
        </Tooltip>
      ),
    },
    {
      title: '操作',
      width: 130,
      fixed: 'right',
      render: (_, record) => (
        <Space size={0}>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handlers.onViewDetail(record)}>
            详情
          </Button>
          <PermissionGuard code="admin:conv:reports:delete">
            <Popconfirm title="确定删除该举报记录？" onConfirm={() => void handlers.onDelete(record.id)}>
              <Button type="link" size="small" danger icon={<DeleteOutlined />}>
                删除
              </Button>
            </Popconfirm>
          </PermissionGuard>
        </Space>
      ),
    },
  ];
}
