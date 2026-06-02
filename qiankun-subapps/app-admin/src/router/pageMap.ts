import type { ComponentType } from 'react';
import {
  AboutPage,
  ArticlesPage,
  ContactPage,
  MessagesPage,
  NavPage,
  ProjectsPage,
  SitePage,
} from '../pages';
import type { AdminTab } from '../types';

/** Tab 与页面组件映射，新增后台页时在此注册 */
export const ADMIN_PAGE_MAP: Record<AdminTab, ComponentType> = {
  site: SitePage,
  nav: NavPage,
  articles: ArticlesPage,
  projects: ProjectsPage,
  about: AboutPage,
  contact: ContactPage,
  messages: MessagesPage,
};
