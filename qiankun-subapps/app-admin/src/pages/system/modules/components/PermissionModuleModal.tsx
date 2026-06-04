import { Form, Input, InputNumber, Modal } from 'antd';
import type { FormInstance } from 'antd/es/form';
import type { AdminModuleRecord } from '../../../../types/rbac';

export interface PermissionModuleModalProps {
  open: boolean;
  parentMenu: AdminModuleRecord | null;
  editingPermId: number | null;
  form: FormInstance;
  onCancel: () => void;
  onOk: () => void;
}

/** 权限点新建/编辑弹窗 */
export default function PermissionModuleModal({
  open,
  parentMenu,
  editingPermId,
  form,
  onCancel,
  onOk,
}: PermissionModuleModalProps) {
  const title = editingPermId
    ? `编辑权限点 — ${parentMenu?.name}`
    : `新增权限点 — ${parentMenu?.name}`;

  return (
    <Modal title={title} open={open} onCancel={onCancel} onOk={onOk} destroyOnClose>
      <Form form={form} layout="vertical" initialValues={{ sort: 0 }}>
        <Form.Item name="name" label="名称" rules={[{ required: true }]}>
          <Input placeholder="如：新建、编辑、删除" />
        </Form.Item>
        <Form.Item name="code" label="权限编码" rules={[{ required: true }]}>
          <Input placeholder="admin:articles:create" disabled={Boolean(editingPermId)} />
        </Form.Item>
        <Form.Item name="sort" label="排序">
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
