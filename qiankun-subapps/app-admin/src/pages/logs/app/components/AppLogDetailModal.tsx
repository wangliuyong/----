import { Modal, Tag } from 'antd';
import type { AppLog } from '../../../../api/logs.api';
import { LEVEL_COLORS } from '../constants';

export interface AppLogDetailModalProps {
  record: AppLog | null;
  onClose: () => void;
}

/** 应用日志详情弹窗 */
export default function AppLogDetailModal({ record, onClose }: AppLogDetailModalProps) {
  return (
    <Modal
      title="日志详情"
      open={Boolean(record)}
      footer={null}
      width={640}
      onCancel={onClose}
    >
      {record && (
        <>
          <p>
            <Tag color={LEVEL_COLORS[record.level] ?? 'default'}>
              {record.level.toUpperCase()}
            </Tag>
            {record.context && <Tag style={{ marginLeft: 8 }}>{record.context}</Tag>}
            <span style={{ marginLeft: 8, color: '#999' }}>
              {new Date(record.createdAt).toLocaleString()}
            </span>
          </p>
          <pre
            style={{
              background: '#f5f5f5',
              padding: 12,
              borderRadius: 6,
              fontSize: 13,
              whiteSpace: 'pre-wrap',
            }}
          >
            {record.message}
          </pre>
          {record.stack && (
            <>
              <p style={{ marginTop: 12, fontWeight: 600 }}>堆栈信息</p>
              <pre
                style={{
                  background: '#fff1f0',
                  padding: 12,
                  borderRadius: 6,
                  fontSize: 12,
                  maxHeight: 240,
                  overflow: 'auto',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {record.stack}
              </pre>
            </>
          )}
        </>
      )}
    </Modal>
  );
}
