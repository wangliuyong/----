import type { AdminTab } from '../types';
import AboutPage from './about';
import ArticlesPage from './articles';
import ContactPage from './contact';
import LoginPage from './login';
import MessagesPage from './messages';
import NavPage from './nav';
import ProjectsPage from './projects';
import SitePage from './site';

/** 路由 Tab 与页面组件映射 */
export const ADMIN_PAGE_MAP: Record<AdminTab, typeof SitePage> = {
  site: SitePage,
  nav: NavPage,
  articles: ArticlesPage,
  projects: ProjectsPage,
  about: AboutPage,
  contact: ContactPage,
  messages: MessagesPage,
};

export { default as AboutPage } from './about';
export type { AboutPageProps } from './about/types';
export { default as ArticlesPage } from './articles';
export type { ArticlesPageProps } from './articles/types';
export { default as ContactPage } from './contact';
export type { ContactPageProps } from './contact/types';
export { default as LoginPage } from './login';
export type { LoginFormValues, LoginPageProps } from './login/types';
export { default as MessagesPage } from './messages';
export type { MessagesPageProps } from './messages/types';
export { default as NavPage } from './nav';
export type { NavPageProps } from './nav/types';
export { default as PageLoading } from './_common/PageLoading';
export { default as ProjectsPage } from './projects';
export type { ProjectsPageProps } from './projects/types';
export { default as SitePage } from './site';
export type { SitePageProps } from './site/types';
