import {
  FileTextOutlined,
  ProjectOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import type { ComponentType } from 'react';

/** 登录页左侧能力说明项 */
export interface LoginFeatureItem {
  /** Ant Design 图标组件 */
  icon: ComponentType;
  /** 能力标题 */
  title: string;
  /** 一行说明 */
  description: string;
}

/** 与后台实际模块对齐的展示文案（纯展示，不参与路由） */
export const LOGIN_FEATURES: LoginFeatureItem[] = [
  {
    icon: FileTextOutlined,
    title: '内容与文章',
    description: '维护站点文案、博客文章与页面说明。',
  },
  {
    icon: ProjectOutlined,
    title: '项目与友链',
    description: '更新作品集、友链与导航配置。',
  },
  {
    icon: SafetyCertificateOutlined,
    title: '权限与日志',
    description: '管理账号权限，查看操作与审计记录。',
  },
];
