import { Card, Typography } from 'antd';
import type { ReactNode } from 'react';

export interface KnowledgePageCardProps {
  children: ReactNode;
}

/** 知识库页主卡片容器 */
export default function KnowledgePageCard({ children }: KnowledgePageCardProps) {
  return (
    <Card
      title="知识库管理"
      extra={
        <Typography.Text type="secondary">
          数据存储于 LanceDB 向量库，以下为已向量化分块
        </Typography.Text>
      }
    >
      {children}
    </Card>
  );
}
