import { DeleteOutlined } from '@ant-design/icons';
import { Alert, Button, Modal, Popconfirm, Tag, Typography } from 'antd';
import type { AiChatSessionDetail } from '../../../../api/ai.api';
import PageLoading from '../../../../components/_common/PageLoading';
import PermissionGuard from '../../../../components/PermissionGuard';
import { formatSessionTime } from '../constants';

export interface QaSessionDetailModalProps {
  open: boolean;
  loading: boolean;
  detail: AiChatSessionDetail | null;
  onClose: () => void;
  onDelete: (id: string) => void;
}

/** 用户问答会话详情弹窗：完整对话 + 删除 */
export default function QaSessionDetailModal({
  open,
  loading,
  detail,
  onClose,
  onDelete,
}: QaSessionDetailModalProps) {
  return (
    <Modal
      title="会话详情"
      open={open}
      onCancel={onClose}
      footer={null}
      width={760}
      destroyOnClose
    >
      {loading && <PageLoading />}
      {detail && !loading && (
        <div>
          <Typography.Paragraph type="secondary">
            会话 ID：<Typography.Text copyable code>{detail.id}</Typography.Text>
            {' · '}
            消息 {detail.messageCount} 条
            {' · '}
            创建于 {formatSessionTime(detail.createdAt)}
          </Typography.Paragraph>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {detail.messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  padding: 12,
                  borderRadius: 8,
                  background:
                    msg.role === 'user'
                      ? 'var(--ant-color-primary-bg, var(--ed-accent-soft))'
                      : 'var(--ant-color-fill-quaternary, #f5f5f5)',
                }}
              >
                <div style={{ marginBottom: 6 }}>
                  <Tag
                    color={msg.role === 'user' ? undefined : 'default'}
                    style={
                      msg.role === 'user'
                        ? {
                            color: 'var(--ed-accent)',
                            background: 'var(--ed-accent-soft)',
                            borderColor: 'var(--ed-accent-border)',
                          }
                        : undefined
                    }
                  >
                    {msg.role === 'user' ? '用户' : '助手'}
                  </Tag>
                  <Typography.Text type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>
                    {formatSessionTime(msg.createdAt)}
                  </Typography.Text>
                </div>
                <Typography.Paragraph
                  style={{ marginBottom: 0, whiteSpace: 'pre-wrap' }}
                >
                  {msg.content || '（无文本内容）'}
                </Typography.Paragraph>
                {msg.error && (
                  <Alert
                    type="error"
                    message={msg.error}
                    style={{ marginTop: 8 }}
                    showIcon
                  />
                )}
              </div>
            ))}
          </div>

          <PermissionGuard code="admin:ai-qa:delete">
            <Popconfirm
              title="确定删除该会话？"
              onConfirm={() => onDelete(detail.id)}
            >
              <Button danger icon={<DeleteOutlined />} style={{ marginTop: 16 }}>
                删除本会话
              </Button>
            </Popconfirm>
          </PermissionGuard>
        </div>
      )}
    </Modal>
  );
}
