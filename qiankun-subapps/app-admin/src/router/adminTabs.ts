import {
  AppstoreOutlined,
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
import {
  AboutPage,
  ArticlesPage,
  ContactPage,
  LinksPage,
  MessagesPage,
  NavPage,
  ProjectsPage,
  SitePage,
} from '../pages';

/** 单个后台 Tab：路由 key、文案、图标、页面组件 */
export interface AdminTabItem {
  key: string;
  label: string;
  Icon: ComponentType;
  Page: ComponentType;
}

/** 侧栏功能分组：按业务能力归类，便于扩展与导航 */
export interface AdminMenuGroup {
  key: string;
  label: string;
  Icon: ComponentType;
  items: readonly AdminTabItem[];
}

/**
 * 后台菜单分组 — 单一数据源
 * 新增 Tab 时放入对应分组；路由 / AdminShell 均从此派生
 */
export const ADMIN_MENU_GROUPS: readonly AdminMenuGroup[] = [
  {
    key: 'site-config',
    label: '站点配置',
    Icon: SettingOutlined,
    items: [
      { key: 'site', label: '站点设置', Icon: SettingOutlined, Page: SitePage },
      { key: 'nav', label: '导航管理', Icon: MenuOutlined, Page: NavPage },
      { key: 'about', label: '关于我', Icon: InfoCircleOutlined, Page: AboutPage },
      { key: 'contact', label: '联系我', Icon: MailOutlined, Page: ContactPage },
    ],
  },
  {
    key: 'content',
    label: '内容管理',
    Icon: AppstoreOutlined,
    items: [
      { key: 'articles', label: '博客管理', Icon: FileTextOutlined, Page: ArticlesPage },
      { key: 'projects', label: '项目管理', Icon: ProjectOutlined, Page: ProjectsPage },
      { key: 'links', label: '友链管理', Icon: LinkOutlined, Page: LinksPage },
    ],
  },
  {
    key: 'interaction',
    label: '互动管理',
    Icon: CommentOutlined,
    items: [
      { key: 'messages', label: '留言管理', Icon: CommentOutlined, Page: MessagesPage },
    ],
  },
] as const;

/** 扁平 Tab 列表（路由注册、类型推导） */
export const ADMIN_TAB_CONFIG = ADMIN_MENU_GROUPS.flatMap((group) => group.items);

export type AdminTab = (typeof ADMIN_TAB_CONFIG)[number]['key'];

export const ADMIN_TABS: AdminTab[] = ADMIN_TAB_CONFIG.map((t) => t.key);

export const ADMIN_TAB_LABELS: Record<AdminTab, string> = Object.fromEntries(
  ADMIN_TAB_CONFIG.map((t) => [t.key, t.label]),
) as Record<AdminTab, string>;

/** Tab 与路由页面组件映射 */
export const ADMIN_PAGE_MAP: Record<AdminTab, ComponentType> = Object.fromEntries(
  ADMIN_TAB_CONFIG.map((t) => [t.key, t.Page]),
) as Record<AdminTab, ComponentType>;

/** 查找 Tab 所属分组 key，用于侧栏自动展开当前分类 */
export function findMenuGroupKeyByTab(tab: AdminTab): string {
  const group = ADMIN_MENU_GROUPS.find((g) => g.items.some((item) => item.key === tab));
  return group?.key ?? ADMIN_MENU_GROUPS[0].key;
}
