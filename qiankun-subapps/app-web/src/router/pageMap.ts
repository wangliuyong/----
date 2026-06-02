import type { ComponentType } from 'react';
import {
  AboutPage,
  BlogPage,
  ContactPage,
  HomePage,
  LinksPage,
  ProjectsPage,
} from '../pages';
import type { WebPageKey } from './routes';

/**
 * 前台页面单一数据源：路由 key 与页面组件映射
 * 新增页面时只改 routes + 本文件，App 不再维护 switch
 */
export const WEB_PAGE_CONFIG = [
  { key: 'home', Page: HomePage },
  { key: 'about', Page: AboutPage },
  { key: 'blog', Page: BlogPage },
  { key: 'projects', Page: ProjectsPage },
  { key: 'contact', Page: ContactPage },
  { key: 'links', Page: LinksPage },
] as const satisfies ReadonlyArray<{ key: WebPageKey; Page: ComponentType }>;

export const WEB_PAGE_MAP = Object.fromEntries(
  WEB_PAGE_CONFIG.map((item) => [item.key, item.Page]),
) as Record<WebPageKey, ComponentType>;
