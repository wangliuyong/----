import type { ComponentType } from 'react';
import AboutPage from '../pages/about';
import ArticlesPage from '../pages/articles';
import ContactPage from '../pages/contact';
import LinksPage from '../pages/links';
import MessagesPage from '../pages/messages';
import NavPage from '../pages/nav';
import ProjectsPage from '../pages/projects';
import ModulesPage from '../pages/system/modules';
import RolesPage from '../pages/system/roles';
import SitePage from '../pages/site';
import UsersPage from '../pages/system/users';

/**
 * 页面组件注册表：DB module.component 必须在此登记
 * 新增业务页时同步注册，供动态路由与模块管理下拉使用
 */
export const PAGE_REGISTRY: Record<string, ComponentType> = {
  SitePage,
  NavPage,
  AboutPage,
  ContactPage,
  ArticlesPage,
  ProjectsPage,
  LinksPage,
  MessagesPage,
  ModulesPage,
  RolesPage,
  UsersPage,
};

export const PAGE_REGISTRY_OPTIONS = Object.keys(PAGE_REGISTRY).map((key) => ({
  label: key,
  value: key,
}));

export function getPageComponent(key: string | null | undefined): ComponentType | null {
  if (!key) return null;
  return PAGE_REGISTRY[key] ?? null;
}
