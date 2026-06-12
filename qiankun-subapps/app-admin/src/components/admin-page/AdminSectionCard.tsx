import { Card } from 'antd';
import type { ReactNode } from 'react';

export interface AdminSectionCardProps {
  /** 区块小标题（可选，主标题已在 PageShell hero 中） */
  title?: ReactNode;
  extra?: ReactNode;
  children: ReactNode;
  /** 是否去掉内边距（表格贴边场景） */
  noPadding?: boolean;
}

/**
 * 页面内容区卡片：统一圆角、边框与阴影，承载表格 / 表单 / Tabs
 */
export default function AdminSectionCard({
  title,
  extra,
  children,
  noPadding = false,
}: AdminSectionCardProps) {
  return (
    <Card
      className={`admin-section-card${noPadding ? ' admin-section-card--flush' : ''}`}
      title={title}
      extra={extra}
      bordered={false}
    >
      {children}
    </Card>
  );
}
