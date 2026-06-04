import { Button, Space } from 'antd';
import {
  createUser,
  deleteUser,
  updateUser,
} from '../../../api/rbac/users.api';
import AdminCrudPage from '../../../components/AdminCrudPage';
import PermissionGuard from '../../../components/PermissionGuard';
import type { AdminUserRecord } from '../../../types/rbac';
import UserCrudFormFields from './components/UserCrudFormFields';
import UserResetPasswordModal from './components/UserResetPasswordModal';
import UserRoleAssignModal from './components/UserRoleAssignModal';
import { USER_CRUD_COLUMNS } from './components/userCrudColumns';
import { useUsersPage } from './hooks/useUsersPage';

/** 路由 system/users — 用户管理 */
export default function UsersPage() {
  const page = useUsersPage();

  return (
    <>
      <AdminCrudPage<AdminUserRecord>
        title="用户管理"
        createLabel="新建用户"
        data={page.users}
        loading={page.loading}
        createPermission="admin:system:users:create"
        updatePermission="admin:system:users:update"
        deletePermission="admin:system:users:delete"
        columns={USER_CRUD_COLUMNS}
        deleteConfirmTitle="确定删除该用户？"
        modalTitles={{ create: '新建用户', edit: '编辑用户' }}
        renderForm={() => <UserCrudFormFields />}
        onCreate={async (values) => {
          if (!values.password) throw new Error('请设置密码');
          await createUser(values);
        }}
        onUpdate={async (id, values) => {
          const payload = { ...values };
          if (!payload.password) delete payload.password;
          await updateUser(id, payload);
        }}
        onDelete={async (id) => deleteUser(id)}
        onReload={page.load}
        extraActions={(record) => (
          <Space size={0}>
            <PermissionGuard code="admin:system:users:assign">
              <Button type="link" size="small" onClick={() => page.openRoles(record)}>
                分配角色
              </Button>
            </PermissionGuard>
            <PermissionGuard code="admin:system:users:reset-password">
              <Button type="link" size="small" onClick={() => page.openResetPwd(record)}>
                重置密码
              </Button>
            </PermissionGuard>
          </Space>
        )}
      />

      <UserRoleAssignModal
        open={page.roleModal}
        user={page.activeUser}
        roles={page.roles}
        roleIds={page.roleIds}
        onRoleIdsChange={page.setRoleIds}
        onCancel={() => page.setRoleModal(false)}
        onOk={() => void page.saveRoles()}
      />

      <UserResetPasswordModal
        open={page.pwdModal}
        user={page.activeUser}
        form={page.pwdForm}
        onCancel={() => page.setPwdModal(false)}
        onOk={() => void page.savePwd()}
      />
    </>
  );
}
