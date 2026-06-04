import { Form, Input, Modal } from 'antd';
import type { FormInstance } from 'antd/es/form';
import type { AdminUserRecord } from '../../../../types/rbac';

export interface UserResetPasswordModalProps {
  open: boolean;
  user: AdminUserRecord | null;
  form: FormInstance;
  onCancel: () => void;
  onOk: () => void;
}

/** 重置用户密码弹窗 */
export default function UserResetPasswordModal({
  open,
  user,
  form,
  onCancel,
  onOk,
}: UserResetPasswordModalProps) {
  return (
    <Modal
      title={`重置密码 — ${user?.username}`}
      open={open}
      onCancel={onCancel}
      onOk={onOk}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="password" label="新密码" rules={[{ required: true, min: 6 }]}>
          <Input.Password />
        </Form.Item>
      </Form>
    </Modal>
  );
}
