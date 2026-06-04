import { Modal, Select } from 'antd';
import type { AdminRoleRecord, AdminUserRecord } from '../../../../types/rbac';

export interface UserRoleAssignModalProps {
  open: boolean;
  user: AdminUserRecord | null;
  roles: AdminRoleRecord[];
  roleIds: number[];
  onRoleIdsChange: (ids: number[]) => void;
  onCancel: () => void;
  onOk: () => void;
}

/** 用户角色分配弹窗 */
export default function UserRoleAssignModal({
  open,
  user,
  roles,
  roleIds,
  onRoleIdsChange,
  onCancel,
  onOk,
}: UserRoleAssignModalProps) {
  return (
    <Modal
      title={`分配角色 — ${user?.username}`}
      open={open}
      onCancel={onCancel}
      onOk={onOk}
    >
      <Select
        mode="multiple"
        style={{ width: '100%' }}
        value={roleIds}
        onChange={onRoleIdsChange}
        options={roles.map((r) => ({ label: r.name, value: r.id }))}
      />
    </Modal>
  );
}
