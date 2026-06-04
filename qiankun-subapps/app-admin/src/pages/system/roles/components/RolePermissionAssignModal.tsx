import { Modal, Tree } from 'antd';
import type { DataNode } from 'antd/es/tree';
import type { AdminRoleRecord } from '../../../../types/rbac';

export interface RolePermissionAssignModalProps {
  open: boolean;
  role: AdminRoleRecord | null;
  treeData: DataNode[];
  checkedKeys: number[];
  onCheckedKeysChange: (keys: number[]) => void;
  onCancel: () => void;
  onOk: () => void;
}

/** 角色权限树分配弹窗 */
export default function RolePermissionAssignModal({
  open,
  role,
  treeData,
  checkedKeys,
  onCheckedKeysChange,
  onCancel,
  onOk,
}: RolePermissionAssignModalProps) {
  return (
    <Modal
      title={`分配权限 — ${role?.name ?? ''}`}
      open={open}
      onCancel={onCancel}
      onOk={onOk}
      width={520}
    >
      <Tree
        checkable
        selectable={false}
        treeData={treeData}
        checkedKeys={checkedKeys}
        onCheck={(keys) => {
          const list = Array.isArray(keys) ? keys : keys.checked;
          onCheckedKeysChange(list.filter((k) => typeof k === 'number') as number[]);
        }}
        height={360}
      />
    </Modal>
  );
}
