/** 后台菜单节点（与 API auth/profile 一致） */
export interface AdminMenuNode {
  id: number;
  code: string;
  name: string;
  type: string;
  path: string | null;
  icon: string | null;
  component: string | null;
  sort: number;
  children?: AdminMenuNode[];
}

/** 登录用户 profile */
export interface AdminProfile {
  id: number;
  username: string;
  nickname?: string | null;
  isSuper: boolean;
  permissionCodes: string[];
  menus: AdminMenuNode[];
}

export interface AdminPermissionItem {
  id: number;
  code: string;
  name: string;
  type: string;
  sort: number;
  moduleId?: number;
}

export interface AdminModuleRecord {
  id: number;
  parentId: number | null;
  name: string;
  code: string;
  type: string;
  path: string | null;
  icon: string | null;
  component: string | null;
  sort: number;
  status: number;
  permissions?: AdminPermissionItem[];
}

export interface AdminRoleRecord {
  id: number;
  name: string;
  code: string;
  description?: string | null;
  isSuper: boolean;
  status: number;
  permissions?: { permission: AdminPermissionItem }[];
  _count?: { users: number };
}

export interface AdminUserRecord {
  id: number;
  username: string;
  nickname?: string | null;
  status: number;
  createdAt: string;
  roles: { role: { id: number; name: string; code: string } }[];
}

export interface PermissionAssignNode {
  id: number;
  code: string;
  name: string;
  type: string;
  parentId: number | null;
  permissions: AdminPermissionItem[];
}
