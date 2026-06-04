import { Button, Card } from 'antd';
import { useMemo } from 'react';
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

  if (page.loading) return <PageLoading />;

  return (
    <Card
      title="模块管理"
      extra={
        <PermissionGuard code="admin:system:modules:create">
          <Button type="primary" onClick={page.openTopLevelMenuForm}>
            新建
          </Button>
        </PermissionGuard>
      }
    >
      <ModuleAdminTable treeData={page.treeData} columnHandlers={columnHandlers} />

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
    </Card>
  );
}
