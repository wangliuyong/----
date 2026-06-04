import { Card, Typography } from 'antd';
import type { ReactNode } from 'react';

export interface QaPageCardProps {
  children: ReactNode;
}

/** 用户问答管理页主卡片容器 */
export default function QaPageCard({ children }: QaPageCardProps) {
  return (
    <Card
      title="用户问答管理"
      extra={
        <Typography.Text type="secondary">
          前台 AI 小助手访客提问与回复记录
        </Typography.Text>
      }
    >
      {children}
    </Card>
  );
}
