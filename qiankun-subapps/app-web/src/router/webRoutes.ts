import type { ComponentType } from 'react';
import {
  AboutPage,
  BlogPage,
  ContactPage,
  HomePage,
  LinksPage,
  ProjectsPage,
} from '../pages';

type WebRouteEntry =
  | { index: true; Page: ComponentType }
  | { path: string; Page: ComponentType };

/** 前台路由单一数据源：path 与页面组件 */
export const WEB_ROUTE_CONFIG: WebRouteEntry[] = [
  { index: true, Page: HomePage },
  { path: 'about', Page: AboutPage },
  { path: 'blog', Page: BlogPage },
  { path: 'blog/:id', Page: BlogPage },
  { path: 'projects', Page: ProjectsPage },
  { path: 'contact', Page: ContactPage },
  { path: 'links', Page: LinksPage },
];
