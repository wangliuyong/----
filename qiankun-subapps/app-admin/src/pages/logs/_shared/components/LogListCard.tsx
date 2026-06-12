import type { ReactNode } from 'react';
import { AdminPageShell, AdminSectionCard, type AdminStatItem } from '../../../../components/admin-page';

export interface LogListCardProps {
  title: string;
  description?: string;
  stats?: AdminStatItem[];
  extra?: ReactNode;
  children: ReactNode;
}

/** 日志页主容器：统一 Hero + 统计 + 内容卡片 */
export default function LogListCard({
  title,
  description,
  stats,
  extra,
  children,
}: LogListCardProps) {
  return (
    <AdminPageShell title={title} description={description} stats={stats} extra={extra}>
      <AdminSectionCard>{children}</AdminSectionCard>
    </AdminPageShell>
  );
}
