import type { AdminRoleRecord, PermissionAssignNode } from '../../types/rbac';
import { request, type RequestConfig } from '../client';

const silentGet: Pick<RequestConfig, 'skipErrorMessage'> = { skipErrorMessage: true };

export function listRoles() {
  return request<AdminRoleRecord[]>('/admin/rbac/roles', silentGet);
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
  return request<PermissionAssignNode[]>('/admin/rbac/permission-tree', silentGet);
}

export function assignRolePermissions(id: number, permissionIds: number[]) {
  return request<AdminRoleRecord>(`/admin/rbac/roles/${id}/permissions`, {
    method: 'PUT',
    body: JSON.stringify({ permissionIds }),
  });
}
