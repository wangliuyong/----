import type { AdminModuleRecord, AdminPermissionItem } from '../../types/rbac';
import { request, type RequestConfig } from '../client';

const silentGet: Pick<RequestConfig, 'skipErrorMessage'> = { skipErrorMessage: true };

export function listModules() {
  return request<AdminModuleRecord[]>('/admin/rbac/modules', silentGet);
}

export function createModule(data: Partial<AdminModuleRecord>) {
  return request<AdminModuleRecord>('/admin/rbac/modules', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateModule(id: number, data: Partial<AdminModuleRecord>) {
  return request<AdminModuleRecord>(`/admin/rbac/modules/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteModule(id: number) {
  return request<void>(`/admin/rbac/modules/${id}`, { method: 'DELETE' });
}

export function listModulePermissions(moduleId: number) {
  return request<AdminPermissionItem[]>(
    `/admin/rbac/modules/${moduleId}/permissions`,
    silentGet,
  );
}

export function createPermission(
  moduleId: number,
  data: Partial<AdminPermissionItem>,
) {
  return request<AdminPermissionItem>(
    `/admin/rbac/modules/${moduleId}/permissions`,
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
  );
}

export function updatePermission(id: number, data: Partial<AdminPermissionItem>) {
  return request<AdminPermissionItem>(`/admin/rbac/permissions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deletePermission(id: number) {
  return request<void>(`/admin/rbac/permissions/${id}`, { method: 'DELETE' });
}
