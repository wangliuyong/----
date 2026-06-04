import { SettingOutlined, SyncOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
import type { ReactNode } from 'react';
import PermissionGuard from '../../../../components/PermissionGuard';

export interface AiAssistantToolbarProps {
  configStatus: ReactNode;
  configLoading: boolean;
  configModalOpen: boolean;
  onOpenConfig: () => void;
  onOpenSync: () => void;
}

/** 数据配置管理页顶栏操作：AI 配置、向量化 */
export default function AiAssistantToolbar({
  configStatus,
  configLoading,
  configModalOpen,
  onOpenConfig,
  onOpenSync,
}: AiAssistantToolbarProps) {
  return (
    <Space wrap>
      {configStatus}
      <Button
        type="primary"
        icon={<SettingOutlined />}
        loading={configLoading && !configModalOpen}
        onClick={onOpenConfig}
      >
        AI配置
      </Button>
      <PermissionGuard code="admin:ai-assistant:sync">
        <Button type="primary" icon={<SyncOutlined />} onClick={onOpenSync}>
          向量化数据
        </Button>
      </PermissionGuard>
    </Space>
  );
}
