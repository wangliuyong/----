import type { LinkItem } from '../types';
import { request, type RequestConfig } from './client';

const silentGet: Pick<RequestConfig, 'skipErrorMessage'> = { skipErrorMessage: true };

export function listLinks() {
  return request<LinkItem[]>('/admin/links', silentGet);
}

export function createLink(data: Partial<LinkItem>) {
  return request<LinkItem>('/admin/links', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateLink(id: number, data: Partial<LinkItem>) {
  return request<LinkItem>(`/admin/links/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteLink(id: number) {
  return request<void>(`/admin/links/${id}`, { method: 'DELETE' });
}
