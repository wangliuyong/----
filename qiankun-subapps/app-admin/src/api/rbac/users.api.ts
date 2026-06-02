import type { AdminUserRecord } from '../../types/rbac';
import { request } from '../client';

export function listUsers() {
  return request<AdminUserRecord[]>('/admin/rbac/users');
}

export function createUser(data: Record<string, unknown>) {
  return request<AdminUserRecord>('/admin/rbac/users', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateUser(id: number, data: Record<string, unknown>) {
  return request<AdminUserRecord>(`/admin/rbac/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteUser(id: number) {
  return request<void>(`/admin/rbac/users/${id}`, { method: 'DELETE' });
}

export function assignUserRoles(id: number, roleIds: number[]) {
  return request<AdminUserRecord>(`/admin/rbac/users/${id}/roles`, {
    method: 'PUT',
    body: JSON.stringify({ roleIds }),
  });
}

export function resetUserPassword(id: number, password: string) {
  return request<{ ok: boolean }>(`/admin/rbac/users/${id}/reset-password`, {
    method: 'PUT',
    body: JSON.stringify({ password }),
  });
}
