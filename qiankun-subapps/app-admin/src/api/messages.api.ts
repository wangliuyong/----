import type { Message } from '../types';
import { request, type RequestConfig } from './client';

const silentGet: Pick<RequestConfig, 'skipErrorMessage'> = { skipErrorMessage: true };

export function listMessages() {
  return request<Message[]>('/admin/messages', silentGet);
}

export function deleteMessage(id: number) {
  return request<void>(`/admin/messages/${id}`, { method: 'DELETE' });
}
