import { RobotOutlined, SyncOutlined } from '@ant-design/icons';
import type { ReactNode } from 'react';
import { AdminPageShell, AdminSectionCard } from '../../../../components/admin-page';

export interface AiAssistantPageCardProps {
  extra: ReactNode;
  children: ReactNode;
  /** 向量库文档总数 */
  vectorTotal?: number;
  /** 同步记录数 */
  syncRecordCount?: number;
}

/** 数据配置管理主容器 */
export default function AiAssistantPageCard({
  extra,
  children,
  vectorTotal,
  syncRecordCount,
}: AiAssistantPageCardProps) {
  return (
    <AdminPageShell
      title="数据配置管理"
      description="管理 AI 模型配置、内容向量化同步与 LanceDB 向量库统计"
      extra={extra}
      stats={[
        {
          label: '向量文档',
          value: vectorTotal ?? '-',
          icon: <RobotOutlined />,
          accent: 'primary',
        },
        {
          label: '同步记录',
          value: syncRecordCount ?? '-',
          icon: <SyncOutlined />,
          hint: '历史同步任务',
        },
      ]}
    >
      <AdminSectionCard>{children}</AdminSectionCard>
    </AdminPageShell>
  );
}
