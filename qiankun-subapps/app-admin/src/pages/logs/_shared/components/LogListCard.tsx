import { Card } from 'antd';
import type { ReactNode } from 'react';

export interface LogListCardProps {
  title: string;
  children: ReactNode;
}

/** 日志页主卡片容器 */
export default function LogListCard({ title, children }: LogListCardProps) {
  return <Card title={title}>{children}</Card>;
}
