import { apiUrl } from '../../../_shared/api';
import type {
  Article,
  ContactConfig,
  LinkItem,
  Message,
  NavItem,
  Profile,
  Project,
  SiteConfig,
} from '../types';
import type {
  AdminModuleRecord,
  AdminPermissionItem,
  AdminProfile,
  AdminRoleRecord,
  AdminUserRecord,
  PermissionAssignNode,
} from '../types/rbac';
import { clearAuth, getToken } from './auth';

/** 带 JWT 的管理端请求 */
async function adminFetch<T>(
  apiBase: string,
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const token = getToken();
  if (!token) throw new Error('未登录');

  const res = await fetch(apiUrl(apiBase, path), {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(init.headers || {}),
    },
  });

  if (res.status === 401) {
    clearAuth();
    throw new Error('登录已过期，请重新登录');
  }
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `请求失败: ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

/** 登录（无需 JWT） */
export async function login(
  apiBase: string,
  username: string,
  password: string,
) {
  const res = await fetch(apiUrl(apiBase, '/auth/login'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error('用户名或密码错误');
  return res.json() as Promise<{ accessToken: string; username: string }>;
}

export const adminApi = {
  getSite: (apiBase: string) => adminFetch<SiteConfig>(apiBase, '/admin/site'),

  updateSite: (apiBase: string, data: Partial<SiteConfig>) =>
    adminFetch<SiteConfig>(apiBase, '/admin/site', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  updateNav: (apiBase: string, nav: NavItem[]) =>
    adminFetch<SiteConfig>(apiBase, '/admin/site', {
      method: 'PUT',
      body: JSON.stringify({ nav }),
    }),

  updateAbout: (apiBase: string, about: Profile) =>
    adminFetch<SiteConfig>(apiBase, '/admin/site', {
      method: 'PUT',
      body: JSON.stringify({ about }),
    }),

  updateContact: (apiBase: string, contact: ContactConfig, email?: string, githubUrl?: string) =>
    adminFetch<SiteConfig>(apiBase, '/admin/site', {
      method: 'PUT',
      body: JSON.stringify({ contact, email, githubUrl }),
    }),

  listArticles: (apiBase: string) =>
    adminFetch<Article[]>(apiBase, '/admin/articles'),

  createArticle: (apiBase: string, data: Partial<Article>) =>
    adminFetch<Article>(apiBase, '/admin/articles', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateArticle: (apiBase: string, id: number, data: Partial<Article>) =>
    adminFetch<Article>(apiBase, `/admin/articles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteArticle: (apiBase: string, id: number) =>
    adminFetch<void>(apiBase, `/admin/articles/${id}`, { method: 'DELETE' }),

  listProjects: (apiBase: string) =>
    adminFetch<Project[]>(apiBase, '/admin/projects'),

  createProject: (apiBase: string, data: Partial<Project>) =>
    adminFetch<Project>(apiBase, '/admin/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateProject: (apiBase: string, id: number, data: Partial<Project>) =>
    adminFetch<Project>(apiBase, `/admin/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteProject: (apiBase: string, id: number) =>
    adminFetch<void>(apiBase, `/admin/projects/${id}`, { method: 'DELETE' }),

  listLinks: (apiBase: string) => adminFetch<LinkItem[]>(apiBase, '/admin/links'),

  createLink: (apiBase: string, data: Partial<LinkItem>) =>
    adminFetch<LinkItem>(apiBase, '/admin/links', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateLink: (apiBase: string, id: number, data: Partial<LinkItem>) =>
    adminFetch<LinkItem>(apiBase, `/admin/links/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteLink: (apiBase: string, id: number) =>
    adminFetch<void>(apiBase, `/admin/links/${id}`, { method: 'DELETE' }),

  listMessages: (apiBase: string) =>
    adminFetch<Message[]>(apiBase, '/admin/messages'),

  deleteMessage: (apiBase: string, id: number) =>
    adminFetch<void>(apiBase, `/admin/messages/${id}`, { method: 'DELETE' }),

  getProfile: (apiBase: string) =>
    adminFetch<AdminProfile>(apiBase, '/admin/auth/profile'),

  listModules: (apiBase: string) =>
    adminFetch<AdminModuleRecord[]>(apiBase, '/admin/rbac/modules'),

  createModule: (apiBase: string, data: Partial<AdminModuleRecord>) =>
    adminFetch<AdminModuleRecord>(apiBase, '/admin/rbac/modules', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateModule: (apiBase: string, id: number, data: Partial<AdminModuleRecord>) =>
    adminFetch<AdminModuleRecord>(apiBase, `/admin/rbac/modules/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteModule: (apiBase: string, id: number) =>
    adminFetch<void>(apiBase, `/admin/rbac/modules/${id}`, { method: 'DELETE' }),

  listModulePermissions: (apiBase: string, moduleId: number) =>
    adminFetch<AdminPermissionItem[]>(apiBase, `/admin/rbac/modules/${moduleId}/permissions`),

  createPermission: (apiBase: string, moduleId: number, data: Partial<AdminPermissionItem>) =>
    adminFetch<AdminPermissionItem>(apiBase, `/admin/rbac/modules/${moduleId}/permissions`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updatePermission: (apiBase: string, id: number, data: Partial<AdminPermissionItem>) =>
    adminFetch<AdminPermissionItem>(apiBase, `/admin/rbac/permissions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deletePermission: (apiBase: string, id: number) =>
    adminFetch<void>(apiBase, `/admin/rbac/permissions/${id}`, { method: 'DELETE' }),

  getPermissionTree: (apiBase: string) =>
    adminFetch<PermissionAssignNode[]>(apiBase, '/admin/rbac/permission-tree'),

  listRoles: (apiBase: string) => adminFetch<AdminRoleRecord[]>(apiBase, '/admin/rbac/roles'),

  createRole: (apiBase: string, data: Partial<AdminRoleRecord>) =>
    adminFetch<AdminRoleRecord>(apiBase, '/admin/rbac/roles', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateRole: (apiBase: string, id: number, data: Partial<AdminRoleRecord>) =>
    adminFetch<AdminRoleRecord>(apiBase, `/admin/rbac/roles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteRole: (apiBase: string, id: number) =>
    adminFetch<void>(apiBase, `/admin/rbac/roles/${id}`, { method: 'DELETE' }),

  assignRolePermissions: (apiBase: string, id: number, permissionIds: number[]) =>
    adminFetch<AdminRoleRecord>(apiBase, `/admin/rbac/roles/${id}/permissions`, {
      method: 'PUT',
      body: JSON.stringify({ permissionIds }),
    }),

  listUsers: (apiBase: string) => adminFetch<AdminUserRecord[]>(apiBase, '/admin/rbac/users'),

  createUser: (apiBase: string, data: Record<string, unknown>) =>
    adminFetch<AdminUserRecord>(apiBase, '/admin/rbac/users', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateUser: (apiBase: string, id: number, data: Record<string, unknown>) =>
    adminFetch<AdminUserRecord>(apiBase, `/admin/rbac/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteUser: (apiBase: string, id: number) =>
    adminFetch<void>(apiBase, `/admin/rbac/users/${id}`, { method: 'DELETE' }),

  assignUserRoles: (apiBase: string, id: number, roleIds: number[]) =>
    adminFetch<AdminUserRecord>(apiBase, `/admin/rbac/users/${id}/roles`, {
      method: 'PUT',
      body: JSON.stringify({ roleIds }),
    }),

  resetUserPassword: (apiBase: string, id: number, password: string) =>
    adminFetch<{ ok: boolean }>(apiBase, `/admin/rbac/users/${id}/reset-password`, {
      method: 'PUT',
      body: JSON.stringify({ password }),
    }),
};
