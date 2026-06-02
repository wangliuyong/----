import type { Project } from '../types';
import { request, type RequestConfig } from './client';

const silentGet: Pick<RequestConfig, 'skipErrorMessage'> = { skipErrorMessage: true };

export function listProjects() {
  return request<Project[]>('/admin/projects', silentGet);
}

export function createProject(data: Partial<Project>) {
  return request<Project>('/admin/projects', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateProject(id: number, data: Partial<Project>) {
  return request<Project>(`/admin/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteProject(id: number) {
  return request<void>(`/admin/projects/${id}`, { method: 'DELETE' });
}
