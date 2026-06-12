import { DeleteOutlined } from '@ant-design/icons';
import { Button, Popconfirm } from 'antd';
import PermissionGuard from '../../../../components/PermissionGuard';

export interface QaBatchDeleteBarProps {
  selectedCount: number;
  onConfirm: () => void;
}

/** 用户问答批量删除操作栏 */
export default function QaBatchDeleteBar({
  selectedCount,
  onConfirm,
}: QaBatchDeleteBarProps) {
  if (selectedCount <= 0) return null;

  return (
    <PermissionGuard code="admin:ai-qa:delete">
      <div className="admin-batch-bar">
        <span className="admin-batch-bar__count">
          已选 <strong>{selectedCount}</strong> 条会话
        </span>
        <Popconfirm
          title={`确定删除选中的 ${selectedCount} 条会话？`}
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
