import { Form, message } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { listRoles } from '../../../../api/rbac/roles.api';
import {
  assignUserRoles,
  listUsers,
  resetUserPassword,
} from '../../../../api/rbac/users.api';
import type { AdminRoleRecord, AdminUserRecord } from '../../../../types/rbac';

/** 用户管理页：列表加载、角色分配、重置密码 */
export function useUsersPage() {
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
      const [userList, roleList] = await Promise.all([listUsers(), listRoles()]);
      setUsers(userList);
      setRoles(roleList);
    } catch {
      /* 错误已由 request 拦截器 toast */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
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
    void load();
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

  return {
    users,
    roles,
    loading,
    load,
    roleModal,
    setRoleModal,
    pwdModal,
    setPwdModal,
    activeUser,
    roleIds,
    setRoleIds,
    pwdForm,
    openRoles,
    saveRoles,
    openResetPwd,
    savePwd,
  };
}
