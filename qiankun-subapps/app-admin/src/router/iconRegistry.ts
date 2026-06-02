import {
  AppstoreOutlined,
  BlockOutlined,
  CommentOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  LinkOutlined,
  MailOutlined,
  MenuOutlined,
  ProjectOutlined,
  SafetyOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { ComponentType } from 'react';

/** 图标名 -> 组件（与 DB module.icon 字段对应） */
const ICON_MAP: Record<string, ComponentType> = {
  SettingOutlined,
  MenuOutlined,
  InfoCircleOutlined,
  MailOutlined,
  FileTextOutlined,
  ProjectOutlined,
  LinkOutlined,
  CommentOutlined,
  AppstoreOutlined,
  SafetyOutlined,
  BlockOutlined,
  TeamOutlined,
  UserOutlined,
};

export function resolveIcon(name: string | null | undefined): ComponentType {
  if (name && ICON_MAP[name]) return ICON_MAP[name];
  return AppstoreOutlined;
}

export const ICON_OPTIONS = Object.keys(ICON_MAP).map((key) => ({ label: key, value: key }));
