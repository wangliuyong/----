import { DeleteOutlined } from '@ant-design/icons';
import { Button, Modal, Popconfirm, Tag, Typography } from 'antd';
import type { KnowledgeChunkDetail } from '../../../../api/ai.api';
import PageLoading from '../../../../components/_common/PageLoading';
import PermissionGuard from '../../../../components/PermissionGuard';
import { SOURCE_LABEL } from '../constants';

export interface KnowledgeChunkDetailModalProps {
  open: boolean;
  loading: boolean;
  detail: KnowledgeChunkDetail | null;
  onClose: () => void;
  onDelete: (id: string) => void;
}

/** 向量块详情弹窗：元信息 + 全文 + 删除 */
export default function KnowledgeChunkDetailModal({
  open,
  loading,
  detail,
  onClose,
  onDelete,
}: KnowledgeChunkDetailModalProps) {
  return (
    <Modal
      title={detail?.title || '向量块详情'}
      open={open}
      onCancel={onClose}
      footer={null}
      width={720}
      destroyOnClose
    >
      {loading && <PageLoading />}
      {detail && !loading && (
        <div>
          <p>
            <Tag>{SOURCE_LABEL[detail.source] ?? detail.source}</Tag>
            <Typography.Text type="secondary" style={{ marginLeft: 8 }}>
              来源 ID：{detail.sourceId}
              {detail.slug ? ` · slug：${detail.slug}` : ''}
            </Typography.Text>
          </p>
          <Typography.Paragraph
            style={{
              maxHeight: 400,
              overflow: 'auto',
              whiteSpace: 'pre-wrap',
              background: 'var(--ant-color-fill-quaternary, #f5f5f5)',
              padding: 12,
              borderRadius: 8,
            }}
          >
            {detail.text}
          </Typography.Paragraph>
          <PermissionGuard code="admin:ai-knowledge:delete">
            <Popconfirm
              title="确定删除该向量块？"
              onConfirm={() => onDelete(detail.id)}
            >
              <Button danger icon={<DeleteOutlined />}>
                删除本条
              </Button>
            </Popconfirm>
          </PermissionGuard>
        </div>
      )}
    </Modal>
  );
}
