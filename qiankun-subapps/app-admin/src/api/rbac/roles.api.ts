import type { AdminRoleRecord, PermissionAssignNode } from '../../types/rbac';
import { request } from '../client';

export function listRoles() {
  return request<AdminRoleRecord[]>('/admin/rbac/roles');
}

export function createRole(data: Partial<AdminRoleRecord>) {
  return request<AdminRoleRecord>('/admin/rbac/roles', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateRole(id: number, data: Partial<AdminRoleRecord>) {
  return request<AdminRoleRecord>(`/admin/rbac/roles/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteRole(id: number) {
  return request<void>(`/admin/rbac/roles/${id}`, { method: 'DELETE' });
}

export function getPermissionTree() {
  return request<PermissionAssignNode[]>('/admin/rbac/permission-tree');
}

export function assignRolePermissions(id: number, permissionIds: number[]) {
  return request<AdminRoleRecord>(`/admin/rbac/roles/${id}/permissions`, {
    method: 'PUT',
    body: JSON.stringify({ permissionIds }),
  });
}
