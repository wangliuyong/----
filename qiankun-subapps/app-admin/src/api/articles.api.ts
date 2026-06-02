import type { Article } from '../types';
import { request, type RequestConfig } from './client';

const silentGet: Pick<RequestConfig, 'skipErrorMessage'> = { skipErrorMessage: true };

export function listArticles() {
  return request<Article[]>('/admin/articles', silentGet);
}

export function createArticle(data: Partial<Article>) {
  return request<Article>('/admin/articles', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateArticle(id: number, data: Partial<Article>) {
  return request<Article>(`/admin/articles/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteArticle(id: number) {
  return request<void>(`/admin/articles/${id}`, { method: 'DELETE' });
}
