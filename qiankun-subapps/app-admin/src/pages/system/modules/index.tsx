import { AppstoreOutlined, PlusOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useMemo } from 'react';
import {
  AdminPageShell,
  AdminSectionCard,
} from '../../../components/admin-page';
import PageLoading from '../../../components/_common/PageLoading';
import PermissionGuard from '../../../components/PermissionGuard';
import MenuModuleModal from './components/MenuModuleModal';
import ModuleAdminTable from './components/ModuleAdminTable';
import PermissionModuleModal from './components/PermissionModuleModal';
import { useModulesPage } from './hooks/useModulesPage';

/** 路由 system/modules — 菜单与权限点管理 */
export default function ModulesPage() {
  const page = useModulesPage();

  const columnHandlers = useMemo(
    () => ({
      modules: page.modules,
      onOpenChildMenu: page.openChildMenuForm,
      onOpenPermCreate: page.openPermForm,
      onOpenPermEdit: page.openPermForm,
      onOpenMenuEdit: page.openMenuFormEdit,
      onDeletePermission: (id: number) => void page.deletePermissionById(id),
      onDeleteModule: (id: number) => void page.deleteModuleById(id),
    }),
    [
      page.modules,
      page.openChildMenuForm,
      page.openPermForm,
      page.openMenuFormEdit,
      page.deletePermissionById,
      page.deleteModuleById,
    ],
  );

  const permissionCount = useMemo(
    () => page.modules.reduce((sum, m) => sum + (m.permissions?.length ?? 0), 0),
    [page.modules],
  );

  if (page.loading) return <PageLoading />;

  return (
    <AdminPageShell
      title="模块管理"
      description="配置后台菜单树与按钮级权限点，变更后需重新登录生效"
      stats={[
        {
          label: '菜单模块',
          value: page.modules.length,
          icon: <AppstoreOutlined />,
          accent: 'primary',
        },
        {
          label: '权限点',
          value: permissionCount,
          icon: <SafetyCertificateOutlined />,
          hint: '按钮级控制',
        },
      ]}
      extra={
        <PermissionGuard code="admin:system:modules:create">
          <Button type="primary" icon={<PlusOutlined />} onClick={page.openTopLevelMenuForm}>
            新建菜单
          </Button>
        </PermissionGuard>
      }
    >
      <AdminSectionCard noPadding>
        <ModuleAdminTable treeData={page.treeData} columnHandlers={columnHandlers} />
      </AdminSectionCard>

      <MenuModuleModal
        open={page.menuModal}
        title={page.menuModalTitle}
        form={page.menuForm}
        formMode={page.menuFormMode}
        childParentMenu={page.childParentMenu}
        editingMenu={page.editingMenu}
        parentTreeData={page.parentTreeData}
        onCancel={() => page.setMenuModal(false)}
        onOk={() => void page.saveMenu()}
      />

      <PermissionModuleModal
        open={page.permModal}
        parentMenu={page.permParentMenu}
        editingPermId={page.editingPermId}
        form={page.permForm}
        onCancel={() => page.setPermModal(false)}
        onOk={() => void page.savePermission()}
      />
    </AdminPageShell>
  );
}
