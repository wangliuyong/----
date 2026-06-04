import { RobotOutlined } from '@ant-design/icons';
import { Card } from 'antd';
import type { ReactNode } from 'react';

export interface AiAssistantPageCardProps {
  extra: ReactNode;
  children: ReactNode;
}

/** 数据配置管理主卡片 */
export default function AiAssistantPageCard({ extra, children }: AiAssistantPageCardProps) {
  return (
    <Card
      title={
        <span>
          <RobotOutlined style={{ marginRight: 8 }} />
          数据配置管理
        </span>
      }
      extra={extra}
    >
      {children}
    </Card>
  );
}
