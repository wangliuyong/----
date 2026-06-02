import type { ContactConfig, NavItem, Profile, SiteConfig } from '../types';
import { request } from './client';

export function getSite() {
  return request<SiteConfig>('/admin/site');
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
