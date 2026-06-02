import { apiUrl } from '../../../_shared/api';
import type {
  Article,
  ContactConfig,
  LinkItem,
  Message,
  NavItem,
  Profile,
  Project,
  SiteConfig,
} from '../types';
import { clearAuth, getToken } from './auth';

/** 带 JWT 的管理端请求 */
async function adminFetch<T>(
  apiBase: string,
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const token = getToken();
  if (!token) throw new Error('未登录');

  const res = await fetch(apiUrl(apiBase, path), {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(init.headers || {}),
    },
  });

  if (res.status === 401) {
    clearAuth();
    throw new Error('登录已过期，请重新登录');
  }
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `请求失败: ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

/** 登录（无需 JWT） */
export async function login(
  apiBase: string,
  username: string,
  password: string,
) {
  const res = await fetch(apiUrl(apiBase, '/auth/login'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error('用户名或密码错误');
  return res.json() as Promise<{ accessToken: string; username: string }>;
}

export const adminApi = {
  getSite: (apiBase: string) => adminFetch<SiteConfig>(apiBase, '/admin/site'),

  updateSite: (apiBase: string, data: Partial<SiteConfig>) =>
    adminFetch<SiteConfig>(apiBase, '/admin/site', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  updateNav: (apiBase: string, nav: NavItem[]) =>
    adminFetch<SiteConfig>(apiBase, '/admin/site', {
      method: 'PUT',
      body: JSON.stringify({ nav }),
    }),

  updateAbout: (apiBase: string, about: Profile) =>
    adminFetch<SiteConfig>(apiBase, '/admin/site', {
      method: 'PUT',
      body: JSON.stringify({ about }),
    }),

  updateContact: (apiBase: string, contact: ContactConfig, email?: string, githubUrl?: string) =>
    adminFetch<SiteConfig>(apiBase, '/admin/site', {
      method: 'PUT',
      body: JSON.stringify({ contact, email, githubUrl }),
    }),

  listArticles: (apiBase: string) =>
    adminFetch<Article[]>(apiBase, '/admin/articles'),

  createArticle: (apiBase: string, data: Partial<Article>) =>
    adminFetch<Article>(apiBase, '/admin/articles', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateArticle: (apiBase: string, id: number, data: Partial<Article>) =>
    adminFetch<Article>(apiBase, `/admin/articles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteArticle: (apiBase: string, id: number) =>
    adminFetch<void>(apiBase, `/admin/articles/${id}`, { method: 'DELETE' }),

  listProjects: (apiBase: string) =>
    adminFetch<Project[]>(apiBase, '/admin/projects'),

  createProject: (apiBase: string, data: Partial<Project>) =>
    adminFetch<Project>(apiBase, '/admin/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateProject: (apiBase: string, id: number, data: Partial<Project>) =>
    adminFetch<Project>(apiBase, `/admin/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteProject: (apiBase: string, id: number) =>
    adminFetch<void>(apiBase, `/admin/projects/${id}`, { method: 'DELETE' }),

  listLinks: (apiBase: string) => adminFetch<LinkItem[]>(apiBase, '/admin/links'),

  createLink: (apiBase: string, data: Partial<LinkItem>) =>
    adminFetch<LinkItem>(apiBase, '/admin/links', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateLink: (apiBase: string, id: number, data: Partial<LinkItem>) =>
    adminFetch<LinkItem>(apiBase, `/admin/links/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteLink: (apiBase: string, id: number) =>
    adminFetch<void>(apiBase, `/admin/links/${id}`, { method: 'DELETE' }),

  listMessages: (apiBase: string) =>
    adminFetch<Message[]>(apiBase, '/admin/messages'),

  deleteMessage: (apiBase: string, id: number) =>
    adminFetch<void>(apiBase, `/admin/messages/${id}`, { method: 'DELETE' }),
};
