import { Button, Form, Input, Modal, Select, Space, Tag, message } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { listRoles } from '../../../api/rbac/roles.api';
import {
  assignUserRoles,
  createUser,
  deleteUser,
  listUsers,
  resetUserPassword,
  updateUser,
} from '../../../api/rbac/users.api';
import AdminCrudPage from '../../../components/AdminCrudPage';
import PermissionGuard from '../../../components/PermissionGuard';
import type { AdminRoleRecord, AdminUserRecord } from '../../../types/rbac';

/** 用户管理：CRUD + 角色分配 + 重置密码 */
export default function UsersPage() {
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [roles, setRoles] = useState<AdminRoleRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleModal, setRoleModal] = useState(false);
  const [pwdModal, setPwdModal] = useState(false);
  const [activeUser, setActiveUser] = useState<AdminUserRecord | null>(null);
  const [roleIds, setRoleIds] = useState<number[]>([]);
  const [pwdForm] = Form.useForm();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [userList, roleList] = await Promise.all([
        listUsers(),
        listRoles(),
      ]);
      setUsers(userList);
      setRoles(roleList);
    } catch {
      /* 错误已由 request 拦截器 toast 提示 */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openRoles = (user: AdminUserRecord) => {
    setActiveUser(user);
    setRoleIds(user.roles.map((r) => r.role.id));
    setRoleModal(true);
  };

  const saveRoles = async () => {
    if (!activeUser) return;
    await assignUserRoles(activeUser.id, roleIds);
    message.success('角色已更新');
    setRoleModal(false);
    load();
  };

  const openResetPwd = (user: AdminUserRecord) => {
    setActiveUser(user);
    pwdForm.resetFields();
    setPwdModal(true);
  };

  const savePwd = async () => {
    if (!activeUser) return;
    const { password } = await pwdForm.validateFields();
    await resetUserPassword(activeUser.id, password);
    message.success('密码已重置');
    setPwdModal(false);
  };

  return (
    <>
      <AdminCrudPage<AdminUserRecord>
        title="用户管理"
        createLabel="新建用户"
        data={users}
        loading={loading}
        createPermission="admin:system:users:create"
        updatePermission="admin:system:users:update"
        deletePermission="admin:system:users:delete"
        columns={[
          { title: '用户名', dataIndex: 'username' },
          { title: '昵称', dataIndex: 'nickname' },
          {
            title: '角色',
            dataIndex: 'roles',
            render: (rs: AdminUserRecord['roles']) =>
              rs.map((r) => <Tag key={r.role.id}>{r.role.name}</Tag>),
          },
          {
            title: '状态',
            dataIndex: 'status',
            render: (v: number) => (v === 1 ? '启用' : '禁用'),
          },
        ]}
        deleteConfirmTitle="确定删除该用户？"
        modalTitles={{ create: '新建用户', edit: '编辑用户' }}
        renderForm={() => (
          <>
            <Form.Item name="username" label="用户名" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item
              name="password"
              label="密码"
              rules={[{ min: 6, message: '至少 6 位' }]}
              extra="编辑用户时留空表示不修改密码"
            >
              <Input.Password />
            </Form.Item>
            <Form.Item name="nickname" label="昵称">
              <Input />
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
          if (!values.password) throw new Error('请设置密码');
          await createUser(values);
        }}
        onUpdate={async (id, values) => {
          const payload = { ...values };
          if (!payload.password) delete payload.password;
          await updateUser(id, payload);
        }}
        onDelete={async (id) => {
          await deleteUser(id);
        }}
        onReload={load}
        extraActions={(record) => (
          <Space size={0}>
            <PermissionGuard code="admin:system:users:assign">
              <Button type="link" size="small" onClick={() => openRoles(record)}>
                分配角色
              </Button>
            </PermissionGuard>
            <PermissionGuard code="admin:system:users:reset-password">
              <Button type="link" size="small" onClick={() => openResetPwd(record)}>
                重置密码
              </Button>
            </PermissionGuard>
          </Space>
        )}
      />

      <Modal title={`分配角色 — ${activeUser?.username}`} open={roleModal} onCancel={() => setRoleModal(false)} onOk={saveRoles}>
        <Select
          mode="multiple"
          style={{ width: '100%' }}
          value={roleIds}
          onChange={setRoleIds}
          options={roles.map((r) => ({ label: r.name, value: r.id }))}
        />
      </Modal>

      <Modal title={`重置密码 — ${activeUser?.username}`} open={pwdModal} onCancel={() => setPwdModal(false)} onOk={savePwd}>
        <Form form={pwdForm} layout="vertical">
          <Form.Item name="password" label="新密码" rules={[{ required: true, min: 6 }]}>
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
