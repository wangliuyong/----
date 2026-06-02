/**
 * 管理端类型入口：站点模型复用 _shared；RBAC 类型见 types/rbac.ts
 */
export type { NavItem, SiteConfig, SiteProfile } from '../../../_shared/siteConfig';
export type { Article, LinkItem, Message, Project } from '../../../_shared/contentTypes';
export type * from './rbac';

/** 关于页 Profile 与 _shared SiteProfile 同构，保留别名便于业务语义 */
export type { SiteProfile as Profile } from '../../../_shared/siteConfig';

/** 联系页配置（SiteConfig.contact 的子集） */
export interface ContactConfig {
  intro?: string;
}
