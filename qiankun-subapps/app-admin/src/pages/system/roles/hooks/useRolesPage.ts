import { message } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  assignRolePermissions,
  getPermissionTree,
  listRoles,
} from '../../../../api/rbac/roles.api';
import { buildPermissionAssignTreeData } from '../../../../router/moduleTreeUtils';
import type { AdminRoleRecord, PermissionAssignNode } from '../../../../types/rbac';

/** 角色管理页：列表与权限树分配 */
export function useRolesPage() {
  const [roles, setRoles] = useState<AdminRoleRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [permOpen, setPermOpen] = useState(false);
  const [activeRole, setActiveRole] = useState<AdminRoleRecord | null>(null);
  const [permTree, setPermTree] = useState<PermissionAssignNode[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<number[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setRoles(await listRoles());
    } catch {
      /* 错误已由 request 拦截器 toast */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
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
    void load();
  };

  return {
    roles,
    loading,
    load,
    permOpen,
    setPermOpen,
    activeRole,
    treeData,
    checkedKeys,
    setCheckedKeys,
    openAssign,
    savePermissions,
  };
}
