import { Button, Form, Input, Modal, Select, Tag, Tree, message } from 'antd';
import type { DataNode } from 'antd/es/tree';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  assignRolePermissions,
  createRole,
  deleteRole,
  getPermissionTree,
  listRoles,
  updateRole,
} from '../../../api/rbac/roles.api';
import AdminCrudPage from '../../../components/AdminCrudPage';
import PermissionGuard from '../../../components/PermissionGuard';
import { buildPermissionAssignTreeData } from '../../../router/moduleTreeUtils';
import type { AdminRoleRecord, PermissionAssignNode } from '../../../types/rbac';

/** 角色管理：CRUD + 权限树分配 */
export default function RolesPage() {
  const [roles, setRoles] = useState<AdminRoleRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [permOpen, setPermOpen] = useState(false);
  const [activeRole, setActiveRole] = useState<AdminRoleRecord | null>(null);
  const [permTree, setPermTree] = useState<PermissionAssignNode[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<number[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setRoles(await listRoles());
    } catch (e) {
      setError(e instanceof Error ? e.message : '加载失败');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const treeData = useMemo(() => buildPermissionAssignTreeData(permTree), [permTree]);

  const openAssign = async (role: AdminRoleRecord) => {
    setActiveRole(role);
    setPermTree(await getPermissionTree());
    setCheckedKeys(role.permissions?.map((p) => p.permission.id) ?? []);
    setPermOpen(true);
  };

  const savePermissions = async () => {
    if (!activeRole) return;
    await assignRolePermissions(activeRole.id, checkedKeys);
    message.success('权限已保存');
    setPermOpen(false);
    load();
  };

  return (
    <>
      <AdminCrudPage<AdminRoleRecord>
        title="角色管理"
        createLabel="新建角色"
        data={roles}
        loading={loading}
        error={error}
        createPermission="admin:system:roles:create"
        updatePermission="admin:system:roles:update"
        deletePermission="admin:system:roles:delete"
        columns={[
          { title: '名称', dataIndex: 'name' },
          { title: '编码', dataIndex: 'code' },
          {
            title: '超管',
            dataIndex: 'isSuper',
            render: (v: boolean) => (v ? <Tag color="gold">是</Tag> : '否'),
          },
          {
            title: '状态',
            dataIndex: 'status',
            render: (v: number) => (v === 1 ? '启用' : '禁用'),
          },
        ]}
        deleteConfirmTitle="确定删除该角色？"
        modalTitles={{ create: '新建角色', edit: '编辑角色' }}
        renderForm={() => (
          <>
            <Form.Item name="name" label="名称" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="code" label="编码" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="description" label="描述">
              <Input.TextArea rows={2} />
            </Form.Item>
            <Form.Item name="status" label="状态" initialValue={1}>
              <Select options={[
                { label: '启用', value: 1 },
                { label: '禁用', value: 0 },
              ]} />
            </Form.Item>
          </>
        )}
        onCreate={async (values) => {
          await createRole(values as Partial<AdminRoleRecord>);
        }}
        onUpdate={async (id, values) => {
          await updateRole(id, values as Partial<AdminRoleRecord>);
        }}
        onDelete={async (id) => {
          await deleteRole(id);
        }}
        onReload={load}
        extraActions={(record) => (
          <PermissionGuard code="admin:system:roles:assign">
            <Button type="link" size="small" onClick={() => openAssign(record)}>
              分配权限
            </Button>
          </PermissionGuard>
        )}
      />

      <Modal
        title={`分配权限 — ${activeRole?.name ?? ''}`}
        open={permOpen}
        onCancel={() => setPermOpen(false)}
        onOk={savePermissions}
        width={520}
      >
        <Tree
          checkable
          selectable={false}
          treeData={treeData}
          checkedKeys={checkedKeys}
          onCheck={(keys) => {
            const list = Array.isArray(keys) ? keys : keys.checked;
            setCheckedKeys(list.filter((k) => typeof k === 'number') as number[]);
          }}
          height={360}
        />
      </Modal>
    </>
  );
}
