import { Form, message } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  createModule,
  createPermission,
  deleteModule,
  deletePermission,
  listModules,
  updateModule,
  updatePermission,
} from '../../../../api/rbac/modules.api';
import {
  buildMenuParentTreeData,
  buildModuleAdminTree,
  isMenuGroup,
  type ModuleAdminTreeNode,
} from '../../../../router/moduleTreeUtils';
import type { AdminModuleRecord } from '../../../../types/rbac';

/** 菜单表单模式：一级新建 / 行内子菜单 / 编辑 */
export type MenuFormMode = 'create-top' | 'create-child' | 'edit';

/**
 * 模块管理页：菜单树 CRUD + 权限点 CRUD 状态与提交逻辑。
 */
export function useModulesPage() {
  const [modules, setModules] = useState<AdminModuleRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const [menuModal, setMenuModal] = useState(false);
  const [menuFormMode, setMenuFormMode] = useState<MenuFormMode>('create-top');
  const [childParentMenu, setChildParentMenu] = useState<AdminModuleRecord | null>(null);
  const [editingMenu, setEditingMenu] = useState<Partial<AdminModuleRecord> | null>(null);
  const [menuForm] = Form.useForm();

  const [permModal, setPermModal] = useState(false);
  const [permParentMenu, setPermParentMenu] = useState<AdminModuleRecord | null>(null);
  const [editingPermId, setEditingPermId] = useState<number | null>(null);
  const [permForm] = Form.useForm();

  const loadModules = useCallback(async () => {
    setLoading(true);
    try {
      setModules(await listModules());
    } catch {
      /* 错误已由 request 拦截器 toast */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadModules();
  }, [loadModules]);

  const treeData = useMemo(() => buildModuleAdminTree(modules), [modules]);
  const parentTreeData = useMemo(
    () => buildMenuParentTreeData(modules, menuFormMode === 'edit' ? editingMenu?.id : undefined),
    [modules, menuFormMode, editingMenu?.id],
  );

  const openTopLevelMenuForm = () => {
    setMenuFormMode('create-top');
    setChildParentMenu(null);
    setEditingMenu({});
    menuForm.setFieldsValue({
      type: 'menu',
      sort: 0,
      status: 1,
      isGroup: true,
      parentId: undefined,
    });
    setMenuModal(true);
  };

  const openChildMenuForm = (parent: AdminModuleRecord) => {
    setMenuFormMode('create-child');
    setChildParentMenu(parent);
    setEditingMenu({});
    menuForm.setFieldsValue({
      type: 'menu',
      sort: 0,
      status: 1,
      isGroup: true,
      parentId: parent.id,
    });
    setMenuModal(true);
  };

  const openMenuFormEdit = (record: AdminModuleRecord) => {
    setMenuFormMode('edit');
    setChildParentMenu(null);
    setEditingMenu(record);
    menuForm.setFieldsValue({
      ...record,
      isGroup: isMenuGroup(record),
    });
    setMenuModal(true);
  };

  const openPermForm = (
    parentMenu: AdminModuleRecord,
    perm?: { id: number; name: string; code: string; sort: number },
  ) => {
    setPermParentMenu(parentMenu);
    setEditingPermId(perm?.id ?? null);
    permForm.setFieldsValue(perm ?? { sort: 0 });
    setPermModal(true);
  };

  const menuModalTitle =
    menuFormMode === 'edit'
      ? '编辑菜单'
      : menuFormMode === 'create-child'
        ? `新建子菜单 — ${childParentMenu?.name ?? ''}`
        : '新建一级菜单';

  const saveMenu = async () => {
    const values = await menuForm.validateFields();
    const isGroup = Boolean(values.isGroup);
    const payload = {
      name: values.name,
      code: values.code,
      type: 'menu',
      parentId:
        menuFormMode === 'create-top'
          ? undefined
          : menuFormMode === 'create-child'
            ? childParentMenu?.id
            : values.parentId,
      sort: values.sort,
      status: values.status,
      icon: values.icon,
      path: isGroup ? undefined : values.path,
    };
    if (editingMenu?.id) {
      await updateModule(editingMenu.id, payload);
      message.success('菜单已更新');
    } else {
      await createModule(payload);
      message.success('菜单已创建');
    }
    setMenuModal(false);
    void loadModules();
  };

  const savePermission = async () => {
    if (!permParentMenu) return;
    const values = await permForm.validateFields();
    const payload = {
      name: values.name,
      code: values.code,
      type: 'button' as const,
      sort: values.sort ?? 0,
    };
    if (editingPermId) {
      await updatePermission(editingPermId, payload);
    } else {
      await createPermission(permParentMenu.id, payload);
    }
    message.success('权限点已保存');
    setPermModal(false);
    void loadModules();
  };

  const deletePermissionById = async (permissionId: number) => {
    await deletePermission(permissionId);
    message.success('已删除');
    void loadModules();
  };

  const deleteModuleById = async (moduleId: number) => {
    await deleteModule(moduleId);
    message.success('已删除');
    void loadModules();
  };

  return {
    modules,
    loading,
    treeData,
    parentTreeData,
    menuModal,
    setMenuModal,
    menuFormMode,
    childParentMenu,
    editingMenu,
    menuForm,
    menuModalTitle,
    permModal,
    setPermModal,
    permParentMenu,
    editingPermId,
    permForm,
    openTopLevelMenuForm,
    openChildMenuForm,
    openMenuFormEdit,
    openPermForm,
    saveMenu,
    savePermission,
    deletePermissionById,
    deleteModuleById,
    loadModules,
  };
}

export type { ModuleAdminTreeNode };
