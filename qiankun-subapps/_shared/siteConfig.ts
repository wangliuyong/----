import { apiUrl, fetchJson } from './api';

/** 导航项 */
export interface NavItem {
  href: string;
  label: string;
}

/** 关于页 Profile（与后端 site.types 一致） */
export interface SiteProfile {
  name: string;
  title: string;
  location: string;
  email: string;
  github: string;
  intro: string;
  education: string;
  certifications: string[];
  strengths: string[];
  experiences: Array<{
    period: string;
    company: string;
    role: string;
    summary: string;
  }>;
  skillGroups: Array<{
    title: string;
    description: string;
    items: string[];
  }>;
}

/** 站点公开配置 */
export interface SiteConfig {
  siteName: string;
  githubUrl: string;
  email: string;
  nav: NavItem[];
  about: SiteProfile;
  contact: { intro?: string };
}

/** 拉取站点公开配置（无需鉴权） */
export function fetchSiteConfig(apiBase: string): Promise<SiteConfig> {
  return fetchJson<SiteConfig>(apiUrl(apiBase, '/site/config'));
}
