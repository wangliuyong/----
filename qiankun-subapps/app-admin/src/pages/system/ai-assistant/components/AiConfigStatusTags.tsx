import { Tag } from 'antd';
import type { AiConfigResponse } from '../../../../api/ai.api';

export interface AiConfigStatusTagsProps {
  loading: boolean;
  config: AiConfigResponse | null;
}

/** AI 配置状态标签（顶栏展示） */
export default function AiConfigStatusTags({ loading, config }: AiConfigStatusTagsProps) {
  return (
    <>
      {!loading && config?.hasApiKey && (
        <Tag color="success">
          已配置 API Key{config.apiKeyMasked ? `（${config.apiKeyMasked}）` : ''}
        </Tag>
      )}
      {!loading && !config?.hasApiKey && <Tag color="warning">未配置 API Key</Tag>}
      {!loading && config?.fromEnv && <Tag color="processing">Key 来自环境变量</Tag>}
    </>
  );
}
