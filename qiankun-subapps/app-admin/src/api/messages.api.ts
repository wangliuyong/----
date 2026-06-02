import type { Message } from '../types';
import { request } from './client';

export function listMessages() {
  return request<Message[]>('/admin/messages');
}

export function deleteMessage(id: number) {
  return request<void>(`/admin/messages/${id}`, { method: 'DELETE' });
}
