import { Form, Input, InputNumber, Modal, Select, TreeSelect } from 'antd';
import type { FormInstance } from 'antd/es/form';
import type { TreeSelectProps } from 'antd';
import { ICON_OPTIONS } from '../../../../router/iconRegistry';
import type { MenuFormMode } from '../hooks/useModulesPage';
import type { AdminModuleRecord } from '../../../../types/rbac';

export interface MenuModuleModalProps {
  open: boolean;
  title: string;
  form: FormInstance;
  formMode: MenuFormMode;
  childParentMenu: AdminModuleRecord | null;
  editingMenu: Partial<AdminModuleRecord> | null;
  parentTreeData: NonNullable<TreeSelectProps['treeData']>;
  onCancel: () => void;
  onOk: () => void;
}

/** 菜单新建/编辑弹窗 */
export default function MenuModuleModal({
  open,
  title,
  form,
  formMode,
  childParentMenu,
  editingMenu,
  parentTreeData,
  onCancel,
  onOk,
}: MenuModuleModalProps) {
  return (
    <Modal
      title={title}
      open={open}
      onCancel={onCancel}
      onOk={onOk}
      width={560}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="名称" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="code" label="编码" rules={[{ required: true }]}>
          <Input disabled={Boolean(editingMenu?.id)} />
        </Form.Item>
        {formMode === 'create-top' && (
          <Form.Item label="上级菜单">
            <Input value="无（顶级）" disabled />
          </Form.Item>
        )}
        {formMode === 'create-child' && (
          <>
            <Form.Item name="parentId" hidden>
              <Input />
            </Form.Item>
            <Form.Item label="上级菜单">
              <Input value={childParentMenu?.name ?? ''} disabled />
            </Form.Item>
          </>
        )}
        {formMode === 'edit' && (
          <Form.Item
            name="parentId"
            label="上级菜单"
            extra="仅分组菜单可选，支持任意层级嵌套"
          >
            <TreeSelect
              allowClear
              showSearch
              treeDefaultExpandAll
              treeLine
              treeData={parentTreeData}
              placeholder="无（顶级）"
              style={{ width: '100%' }}
              dropdownStyle={{ maxHeight: 360, overflow: 'auto' }}
              filterTreeNode={(input, node) =>
                String(node.title ?? '')
                  .toLowerCase()
                  .includes(input.trim().toLowerCase())
              }
            />
          </Form.Item>
        )}
        <Form.Item name="isGroup" label="菜单类别">
          <Select
            options={[
              { label: '分组菜单（仅归类，无页面）', value: true },
              { label: '页面菜单（需配置路由 path）', value: false },
            ]}
          />
        </Form.Item>
        <Form.Item noStyle shouldUpdate={(prev, cur) => prev.isGroup !== cur.isGroup}>
          {({ getFieldValue }) =>
            !getFieldValue('isGroup') ? (
              <Form.Item
                name="path"
                label="路由 path"
                rules={[{ required: true }]}
                extra="与 pages 目录对应，如 site 或 system/modules"
              >
                <Input placeholder="如 site 或 system/modules" />
              </Form.Item>
            ) : null
          }
        </Form.Item>
        <Form.Item name="icon" label="图标">
          <Select allowClear options={ICON_OPTIONS} />
        </Form.Item>
        <Form.Item name="sort" label="排序">
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="status" label="状态">
          <Select
            options={[
              { label: '启用', value: 1 },
              { label: '禁用', value: 0 },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
