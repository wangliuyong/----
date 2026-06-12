import { DeleteOutlined } from '@ant-design/icons';
import { Button, Descriptions, Modal, Popconfirm, Space, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import PermissionGuard from '../../../../components/PermissionGuard';
import type { ConvReportItem } from '../../../../types/convenience';
import { INFO_AUDIT_STATUS_MAP, REPORT_TYPE_CONFIG, type ReportTypeKey } from '../constants';

export interface ReportDetailModalProps {
  record: ConvReportItem | null;
  onClose: () => void;
  onDelete: (id: number) => void;
}

/** 举报详情弹窗：完整展示举报上下文与处置建议 */
export default function ReportDetailModal({ record, onClose, onDelete }: ReportDetailModalProps) {
  if (!record) return null;

  const typeCfg = REPORT_TYPE_CONFIG[record.reportType as ReportTypeKey];
  const auditCfg =
    INFO_AUDIT_STATUS_MAP[record.infoAuditStatus as keyof typeof INFO_AUDIT_STATUS_MAP];

  return (
    <Modal
      title="举报详情"
      open={Boolean(record)}
      width={640}
      onCancel={onClose}
      footer={
        <Space>
          <Button onClick={onClose}>关闭</Button>
          <PermissionGuard code="admin:conv:reports:delete">
            <Popconfirm
              title="确定删除该举报记录？"
              onConfirm={() => {
                void onDelete(record.id);
                onClose();
              }}
            >
              <Button danger icon={<DeleteOutlined />}>
                删除记录
              </Button>
            </Popconfirm>
          </PermissionGuard>
        </Space>
      }
    >
      <Descriptions column={1} bordered size="small" className="report-detail-descriptions">
        <Descriptions.Item label="举报 ID">{record.id}</Descriptions.Item>
        <Descriptions.Item label="举报类型">
          {typeCfg ? (
            <Tag color={typeCfg.color} icon={typeCfg.icon}>
              {typeCfg.label}
            </Tag>
          ) : (
            record.reportType
          )}
        </Descriptions.Item>
        <Descriptions.Item label="举报人">
          {record.userNickname || '未设置昵称'}（ID: {record.userId}）
        </Descriptions.Item>
        <Descriptions.Item label="被举报信息">
          <Typography.Text strong>{record.infoTitle}</Typography.Text>
          <Typography.Text type="secondary" style={{ display: 'block', marginTop: 4 }}>
            信息 ID: {record.infoId}
          </Typography.Text>
        </Descriptions.Item>
        <Descriptions.Item label="信息审核状态">
          {auditCfg ? <Tag color={auditCfg.color}>{auditCfg.label}</Tag> : record.infoAuditStatus}
        </Descriptions.Item>
        <Descriptions.Item label="举报说明">
          {record.content || <Typography.Text type="secondary">用户未填写补充说明</Typography.Text>}
        </Descriptions.Item>
        <Descriptions.Item label="举报时间">
          {dayjs(record.createdAt).format('YYYY-MM-DD HH:mm:ss')}
        </Descriptions.Item>
      </Descriptions>

      <div className="report-detail-hint">
        {record.infoAuditStatus === 'APPROVED' ? (
          <Typography.Text type="warning">
            该信息当前为「已通过」状态，建议前往「便民信息审核」复核后决定是否下架。
          </Typography.Text>
        ) : record.infoAuditStatus === 'PENDING' ? (
          <Typography.Text type="secondary">
            被举报信息仍在待审核队列，可在审核页一并处理。
          </Typography.Text>
        ) : (
          <Typography.Text type="secondary">
            被举报信息已驳回，核实无误后可删除本举报记录归档。
          </Typography.Text>
        )}
      </div>
    </Modal>
  );
}
