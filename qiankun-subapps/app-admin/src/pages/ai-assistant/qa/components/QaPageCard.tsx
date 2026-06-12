import { CommentOutlined, MessageOutlined } from '@ant-design/icons';
import type { ReactNode } from 'react';
import { AdminPageShell, AdminSectionCard } from '../../../../components/admin-page';

export interface QaPageCardProps {
  children: ReactNode;
  /** 会话总数 */
  total?: number;
}

/** 用户问答管理页主容器 */
export default function QaPageCard({ children, total }: QaPageCardProps) {
  return (
    <AdminPageShell
      title="用户问答管理"
      description="前台 AI 小助手的访客提问与回复记录，支持检索与批量清理"
      stats={[
        {
          label: '对话会话',
          value: total ?? '-',
          icon: <CommentOutlined />,
          accent: 'primary',
        },
        {
          label: '数据来源',
          value: '前台助手',
          icon: <MessageOutlined />,
          hint: '实时同步',
        },
      ]}
    >
      <AdminSectionCard>{children}</AdminSectionCard>
    </AdminPageShell>
  );
}
