import { DeleteOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Space } from 'antd';
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
    <div style={{ marginBottom: 12 }}>
      <Space>
        <span>已选 {selectedCount} 条会话</span>
        <PermissionGuard code="admin:ai-qa:delete">
          <Popconfirm
            title={`确定删除选中的 ${selectedCount} 条会话？`}
            onConfirm={onConfirm}
          >
            <Button danger icon={<DeleteOutlined />}>
              批量删除
            </Button>
          </Popconfirm>
        </PermissionGuard>
      </Space>
    </div>
  );
}
