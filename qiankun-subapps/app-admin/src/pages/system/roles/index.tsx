import { Button } from 'antd';
import {
  createRole,
  deleteRole,
  updateRole,
} from '../../../api/rbac/roles.api';
import AdminCrudPage from '../../../components/AdminCrudPage';
import PermissionGuard from '../../../components/PermissionGuard';
import type { AdminRoleRecord } from '../../../types/rbac';
import RoleCrudFormFields from './components/RoleCrudFormFields';
import RolePermissionAssignModal from './components/RolePermissionAssignModal';
import { ROLE_CRUD_COLUMNS } from './components/roleCrudColumns';
import { useRolesPage } from './hooks/useRolesPage';

/** 路由 system/roles — 角色管理 */
export default function RolesPage() {
  const page = useRolesPage();

  return (
    <>
      <AdminCrudPage<AdminRoleRecord>
        title="角色管理"
        description="RBAC 角色与权限包，控制菜单与按钮可见性"
        createLabel="新建角色"
        data={page.roles}
        loading={page.loading}
        createPermission="admin:system:roles:create"
        updatePermission="admin:system:roles:update"
        deletePermission="admin:system:roles:delete"
        columns={ROLE_CRUD_COLUMNS}
        deleteConfirmTitle="确定删除该角色？"
        modalTitles={{ create: '新建角色', edit: '编辑角色' }}
        renderForm={() => <RoleCrudFormFields />}
        onCreate={async (values) => createRole(values as Partial<AdminRoleRecord>)}
        onUpdate={async (id, values) => updateRole(id, values as Partial<AdminRoleRecord>)}
        onDelete={async (id) => deleteRole(id)}
        onReload={page.load}
        extraActions={(record) => (
          <PermissionGuard code="admin:system:roles:assign">
            <Button type="link" size="small" onClick={() => void page.openAssign(record)}>
              分配权限
            </Button>
          </PermissionGuard>
        )}
      />

      <RolePermissionAssignModal
        open={page.permOpen}
        role={page.activeRole}
        treeData={page.treeData}
        checkedKeys={page.checkedKeys}
        onCheckedKeysChange={page.setCheckedKeys}
        onCancel={() => page.setPermOpen(false)}
        onOk={() => void page.savePermissions()}
      />
    </>
  );
}
