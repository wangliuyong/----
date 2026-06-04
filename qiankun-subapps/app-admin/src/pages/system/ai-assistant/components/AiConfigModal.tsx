import { Alert, Button, Form, Input, InputNumber, Modal, Select } from 'antd';
import type { FormInstance } from 'antd/es/form';
import type { AiConfigResponse } from '../../../../api/ai.api';
import PermissionGuard from '../../../../components/PermissionGuard';
import type { UseAiConfigResult } from '../hooks/useAiConfig';

interface AiConfigFormValues {
  openaiBaseUrl: string;
  openaiApiKey: string;
  openaiChatModel: string;
  openaiEmbeddingModel: string;
  embeddingDimensions: number;
}

export interface AiConfigModalProps {
  open: boolean;
  saving: boolean;
  loading: boolean;
  config: AiConfigResponse | null;
  form: FormInstance<AiConfigFormValues>;
  isDashscope: boolean;
  dashscopeHint: UseAiConfigResult['dashscopeHint'];
  chatModelOptions: UseAiConfigResult['chatModelOptions'];
  embeddingModelOptions: UseAiConfigResult['embeddingModelOptions'];
  onClose: () => void;
  onSubmit: (values: AiConfigFormValues) => void;
  onEmbeddingModelChange: (model: string) => void;
  onBaseUrlChange: (url: string) => void;
}

/** AI 服务配置编辑弹窗 */
export default function AiConfigModal({
  open,
  saving,
  loading,
  config,
  form,
  isDashscope,
  dashscopeHint,
  chatModelOptions,
  embeddingModelOptions,
  onClose,
  onSubmit,
  onEmbeddingModelChange,
  onBaseUrlChange,
}: AiConfigModalProps) {
  return (
    <Modal
      title="AI 服务配置"
      open={open}
      onCancel={() => !saving && onClose()}
      width={560}
      destroyOnClose={false}
      footer={
        <>
          <Button onClick={onClose} disabled={saving}>
            取消
          </Button>
          <PermissionGuard code="admin:ai-assistant:update">
            <Button type="primary" loading={saving} onClick={() => form.submit()}>
              保存配置
            </Button>
          </PermissionGuard>
        </>
      }
    >
      {config?.fromEnv && (
        <Alert
          type="info"
          showIcon
          message="当前 API Key 来自服务端环境变量"
          description="在此保存后将写入数据库并优先生效。"
          style={{ marginBottom: 16 }}
        />
      )}
      {!config?.hasApiKey && !loading && (
        <Alert
          type="warning"
          showIcon
          message="尚未配置 API Key"
          description="请填写 API Key 与模型配置后保存，再进行数据源同步。"
          style={{ marginBottom: 16 }}
        />
      )}
      {isDashscope && (
        <Alert
          type="info"
          showIcon
          message="通义千问推荐配置"
          description={`对话模型：${dashscopeHint.chatModel}；向量模型：${dashscopeHint.embeddingModel}；向量维度：${dashscopeHint.dimensions}`}
          style={{ marginBottom: 16 }}
        />
      )}

      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item
          label="OPENAI_BASE_URL"
          name="openaiBaseUrl"
          rules={[{ required: true, message: '请输入 API Base URL' }]}
          extra="通义千问：https://dashscope.aliyuncs.com/compatible-mode/v1"
        >
          <Input
            placeholder="https://api.openai.com/v1"
            onBlur={(e) => onBaseUrlChange(e.target.value.trim())}
          />
        </Form.Item>

        <Form.Item
          label="OPENAI_API_KEY"
          name="openaiApiKey"
          extra={
            config?.apiKeyMasked
              ? `当前已配置：${config.apiKeyMasked}（留空则保留原 Key）`
              : '请输入百炼 / OpenAI 兼容 API Key'
          }
        >
          <Input.Password
            placeholder={config?.hasApiKey ? '留空保留原 Key' : 'sk-...'}
            autoComplete="new-password"
          />
        </Form.Item>

        <Form.Item
          label="对话模型 OPENAI_CHAT_MODEL"
          name="openaiChatModel"
          rules={[{ required: true, message: '请选择对话模型' }]}
          extra={isDashscope ? '通义千问对话模型' : 'OpenAI 兼容对话模型'}
        >
          <Select
            options={chatModelOptions}
            placeholder="请选择对话模型"
            showSearch
            optionFilterProp="label"
          />
        </Form.Item>

        <Form.Item
          label="向量模型 OPENAI_EMBEDDING_MODEL"
          name="openaiEmbeddingModel"
          rules={[{ required: true, message: '请选择向量模型' }]}
          extra={
            isDashscope
              ? '通义向量模型，切换后自动更新推荐维度'
              : 'OpenAI 向量模型，切换后自动更新推荐维度'
          }
        >
          <Select
            options={embeddingModelOptions}
            placeholder="请选择向量模型"
            showSearch
            optionFilterProp="label"
            onChange={onEmbeddingModelChange}
          />
        </Form.Item>

        <Form.Item
          label="向量维度"
          name="embeddingDimensions"
          rules={[{ required: true, message: '请输入向量维度' }]}
          extra="通义 text-embedding-v3 默认 1024；OpenAI text-embedding-3-small 为 1536"
        >
          <InputNumber min={64} max={4096} style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
