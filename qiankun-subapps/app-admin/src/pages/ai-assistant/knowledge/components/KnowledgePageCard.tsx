import { DatabaseOutlined } from '@ant-design/icons';
import type { ReactNode } from 'react';
import { AdminPageShell, AdminSectionCard } from '../../../../components/admin-page';

export interface KnowledgePageCardProps {
  children: ReactNode;
  /** 当前列表总数（分页 total） */
  total?: number;
}

/** 知识库页主容器 */
export default function KnowledgePageCard({ children, total }: KnowledgePageCardProps) {
  return (
    <AdminPageShell
      title="知识库管理"
      description="LanceDB 向量库中的已向量化分块，支持检索、查看详情与批量删除"
      stats={[
        {
          label: '向量分块',
          value: total ?? '-',
          icon: <DatabaseOutlined />,
          accent: 'primary',
        },
      ]}
    >
      <AdminSectionCard>{children}</AdminSectionCard>
    </AdminPageShell>
  );
}
