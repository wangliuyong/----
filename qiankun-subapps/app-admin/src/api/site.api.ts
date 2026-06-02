import type { ContactConfig, NavItem, Profile, SiteConfig } from '../types';
import { request, type RequestConfig } from './client';

/** GET 类请求默认静默 toast，由 PageError 展示 */
const silentGet: Pick<RequestConfig, 'skipErrorMessage'> = { skipErrorMessage: true };

export function getSite() {
  return request<SiteConfig>('/admin/site', silentGet);
}

export function updateSite(data: Partial<SiteConfig>) {
  return request<SiteConfig>('/admin/site', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function updateNav(nav: NavItem[]) {
  return request<SiteConfig>('/admin/site', {
    method: 'PUT',
    body: JSON.stringify({ nav }),
  });
}

export function updateAbout(about: Profile) {
  return request<SiteConfig>('/admin/site', {
    method: 'PUT',
    body: JSON.stringify({ about }),
  });
}

export function updateContact(
  contact: ContactConfig,
  email?: string,
  githubUrl?: string,
) {
  return request<SiteConfig>('/admin/site', {
    method: 'PUT',
    body: JSON.stringify({ contact, email, githubUrl }),
  });
}
