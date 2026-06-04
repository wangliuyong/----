import { Modal, Tag } from 'antd';
import type { AuditLog } from '../../../../api/logs.api';
import { ACTION_COLORS, ACTION_LABELS } from '../constants';

export interface AuditLogDetailModalProps {
  record: AuditLog | null;
  onClose: () => void;
}

/** 审计日志详情弹窗 */
export default function AuditLogDetailModal({ record, onClose }: AuditLogDetailModalProps) {
  return (
    <Modal
      title="操作详情"
      open={Boolean(record)}
      footer={null}
      width={520}
      onCancel={onClose}
    >
      {record && (
        <>
          <p>
            <Tag color={ACTION_COLORS[record.action] ?? 'default'}>
              {ACTION_LABELS[record.action] ?? record.action}
            </Tag>
            <span style={{ marginLeft: 8 }}>{record.username ?? '未知用户'}</span>
            <span style={{ marginLeft: 8, color: '#999' }}>
              {new Date(record.createdAt).toLocaleString()}
            </span>
          </p>
          <p>
            <strong>模块：</strong>
            {record.module ?? '-'}
          </p>
          <p>
            <strong>目标 ID：</strong>
            {record.targetId ?? '-'}
          </p>
          <p>
            <strong>IP：</strong>
            {record.ip ?? '-'}
          </p>
          <pre
            style={{
              maxHeight: 240,
              overflow: 'auto',
              background: '#f5f5f5',
              padding: 12,
              borderRadius: 6,
              fontSize: 12,
              whiteSpace: 'pre-wrap',
            }}
          >
            {record.detail ?? '无详情'}
          </pre>
        </>
      )}
    </Modal>
  );
}
