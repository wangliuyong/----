import { DeleteOutlined } from '@ant-design/icons';
import { Button, Popconfirm } from 'antd';
import PermissionGuard from '../../../../components/PermissionGuard';

export interface KnowledgeBatchDeleteBarProps {
  selectedCount: number;
  onConfirm: () => void;
}

/** 批量删除工具条（有选中行时展示） */
export default function KnowledgeBatchDeleteBar({
  selectedCount,
  onConfirm,
}: KnowledgeBatchDeleteBarProps) {
  if (selectedCount <= 0) return null;

  return (
    <PermissionGuard code="admin:ai-knowledge:delete">
      <div className="admin-batch-bar">
        <span className="admin-batch-bar__count">
          已选 <strong>{selectedCount}</strong> 条向量块
        </span>
        <Popconfirm
          title={`确定删除选中的 ${selectedCount} 条向量块？`}
          onConfirm={onConfirm}
        >
          <Button danger icon={<DeleteOutlined />}>
            批量删除
          </Button>
        </Popconfirm>
      </div>
    </PermissionGuard>
  );
}
