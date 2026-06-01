/** 导航项 */
export interface NavItem {
  href: string;
  label: string;
}

/** 关于页 Profile */
export interface Profile {
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

/** 联系页配置 */
export interface ContactConfig {
  intro?: string;
}

/** 站点配置 */
export interface SiteConfig {
  siteName: string;
  githubUrl: string;
  email: string;
  nav: NavItem[];
  about: Profile;
  contact: ContactConfig;
}

/** 文章 */
export interface Article {
  id: number;
  title: string;
  summary: string | null;
  content: string;
  category: string | null;
  tags: string | null;
  slug: string | null;
  publishedAt: string;
}

/** 项目 */
export interface Project {
  id: number;
  name: string;
  desc: string;
  techStack: string | null;
  githubUrl: string | null;
  previewUrl: string | null;
}

/** 友链 */
export interface LinkItem {
  id: number;
  name: string;
  url: string;
  description: string | null;
  avatar: string | null;
  sort: number;
}

/** 留言 */
export interface Message {
  id: number;
  nickname: string;
  contact: string | null;
  content: string;
  createdAt: string;
}

export type AdminTab =
  | 'site'
  | 'nav'
  | 'articles'
  | 'projects'
  | 'about'
  | 'contact'
  | 'messages';
