import type { LinkItem } from '../types';
import { request } from './client';

export function listLinks() {
  return request<LinkItem[]>('/admin/links');
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
