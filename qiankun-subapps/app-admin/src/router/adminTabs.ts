import {
  CommentOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  LinkOutlined,
  MailOutlined,
  MenuOutlined,
  ProjectOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import type { ComponentType } from 'react';
import { AboutPage } from '../features/about';
import { ArticlesPage } from '../features/articles';
import { ContactPage } from '../features/contact';
import { LinksPage } from '../features/links';
import { MessagesPage } from '../features/messages';
import { NavPage } from '../features/nav';
import { ProjectsPage } from '../features/projects';
import { SitePage } from '../features/site';

/**
 * 后台 Tab 单一数据源：顺序、文案、图标、页面组件
 * 新增 Tab 时只改此文件，避免 routes / pageMap / AdminShell 三处分散维护
 */
export const ADMIN_TAB_CONFIG = [
  { key: 'site', label: '站点设置', Icon: SettingOutlined, Page: SitePage },
  { key: 'nav', label: '导航管理', Icon: MenuOutlined, Page: NavPage },
  { key: 'articles', label: '博客管理', Icon: FileTextOutlined, Page: ArticlesPage },
  { key: 'projects', label: '项目管理', Icon: ProjectOutlined, Page: ProjectsPage },
  { key: 'links', label: '友链管理', Icon: LinkOutlined, Page: LinksPage },
  { key: 'about', label: '关于我', Icon: InfoCircleOutlined, Page: AboutPage },
  { key: 'contact', label: '联系我', Icon: MailOutlined, Page: ContactPage },
  { key: 'messages', label: '留言管理', Icon: CommentOutlined, Page: MessagesPage },
] as const;

export type AdminTab = (typeof ADMIN_TAB_CONFIG)[number]['key'];

export const ADMIN_TABS: AdminTab[] = ADMIN_TAB_CONFIG.map((t) => t.key);

export const ADMIN_TAB_LABELS: Record<AdminTab, string> = Object.fromEntries(
  ADMIN_TAB_CONFIG.map((t) => [t.key, t.label]),
) as Record<AdminTab, string>;

/** Tab 与路由页面组件映射 */
export const ADMIN_PAGE_MAP: Record<AdminTab, ComponentType> = Object.fromEntries(
  ADMIN_TAB_CONFIG.map((t) => [t.key, t.Page]),
) as Record<AdminTab, ComponentType>;
