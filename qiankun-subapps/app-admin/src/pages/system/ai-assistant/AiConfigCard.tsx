import { Alert, Button, Card, Form, Input, InputNumber, message } from 'antd';
import { useEffect, useState } from 'react';
import {
  AI_CONFIG_KEY_PLACEHOLDER,
  getAiConfig,
  updateAiConfig,
  type AiConfigResponse,
  type UpdateAiConfigPayload,
} from '../../../api/ai.api';
import PermissionGuard from '../../../components/PermissionGuard';

interface AiConfigFormValues {
  openaiBaseUrl: string;
  openaiApiKey: string;
  openaiChatModel: string;
  openaiEmbeddingModel: string;
  embeddingDimensions: number;
}

interface AiConfigCardProps {
  onSaved?: () => void;
}

/** 通义千问推荐配置（Base URL 含 dashscope 时表单提示） */
const DASHSCOPE_HINT = {
  chatModel: 'qwen-plus',
  embeddingModel: 'text-embedding-v3',
  dimensions: 1024,
};

/**
 * AI 服务配置：API Key、Base URL、对话/向量模型及维度。
 */
export default function AiConfigCard({ onSaved }: AiConfigCardProps) {
  const [form] = Form.useForm<AiConfigFormValues>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState<AiConfigResponse | null>(null);

  useEffect(() => {
    void (async () => {
      setLoading(true);
      try {
        const data = await getAiConfig();
        setConfig(data);
        form.setFieldsValue({
          openaiBaseUrl: data.openaiBaseUrl,
          openaiApiKey: data.hasApiKey ? AI_CONFIG_KEY_PLACEHOLDER : '',
          openaiChatModel: data.openaiChatModel,
          openaiEmbeddingModel: data.openaiEmbeddingModel,
          embeddingDimensions: data.embeddingDimensions,
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [form]);

  const handleSubmit = async (values: AiConfigFormValues) => {
    setSaving(true);
    try {
      const payload: UpdateAiConfigPayload = {
        openaiBaseUrl: values.openaiBaseUrl.trim(),
        openaiChatModel: values.openaiChatModel.trim(),
        openaiEmbeddingModel: values.openaiEmbeddingModel.trim(),
        embeddingDimensions: values.embeddingDimensions,
      };
      const key = values.openaiApiKey?.trim();
      if (key && key !== AI_CONFIG_KEY_PLACEHOLDER) {
        payload.openaiApiKey = key;
      } else if (!config?.hasApiKey && key) {
        payload.openaiApiKey = key;
      }

      const next = await updateAiConfig(payload);
      setConfig(next);
      form.setFieldsValue({
        openaiBaseUrl: next.openaiBaseUrl,
        openaiApiKey: next.hasApiKey ? AI_CONFIG_KEY_PLACEHOLDER : '',
        openaiChatModel: next.openaiChatModel,
        openaiEmbeddingModel: next.openaiEmbeddingModel,
        embeddingDimensions: next.embeddingDimensions,
      });
      message.success('AI 配置已保存');
      onSaved?.();
    } finally {
      setSaving(false);
    }
  };

  const isDashscope = (config?.openaiBaseUrl ?? '').includes('dashscope');

  return (
    <Card type="inner" title="AI 服务配置" loading={loading} style={{ marginBottom: 24 }}>
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
          description={`对话模型：${DASHSCOPE_HINT.chatModel}；向量模型：${DASHSCOPE_HINT.embeddingModel}；向量维度：${DASHSCOPE_HINT.dimensions}`}
          style={{ marginBottom: 16 }}
        />
      )}

      <Form
        form={form}
        layout="vertical"
        style={{ maxWidth: 560 }}
        onFinish={handleSubmit}
      >
        <Form.Item
          label="OPENAI_BASE_URL"
          name="openaiBaseUrl"
          rules={[{ required: true, message: '请输入 API Base URL' }]}
          extra="通义千问：https://dashscope.aliyuncs.com/compatible-mode/v1"
        >
          <Input placeholder="https://api.openai.com/v1" />
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
          rules={[{ required: true, message: '请输入对话模型' }]}
          extra="通义：qwen-plus / qwen-turbo；OpenAI：gpt-4o-mini"
        >
          <Input placeholder="qwen-plus" />
        </Form.Item>

        <Form.Item
          label="向量模型 OPENAI_EMBEDDING_MODEL"
          name="openaiEmbeddingModel"
          rules={[{ required: true, message: '请输入向量模型' }]}
          extra="通义：text-embedding-v3；OpenAI：text-embedding-3-small"
        >
          <Input placeholder="text-embedding-v3" />
        </Form.Item>

        <Form.Item
          label="向量维度"
          name="embeddingDimensions"
          rules={[{ required: true, message: '请输入向量维度' }]}
          extra="通义 text-embedding-v3 默认 1024；OpenAI text-embedding-3-small 为 1536"
        >
          <InputNumber min={64} max={4096} style={{ width: '100%' }} />
        </Form.Item>

        <PermissionGuard code="admin:ai-assistant:update">
          <Button type="primary" htmlType="submit" loading={saving}>
            保存配置
          </Button>
        </PermissionGuard>
      </Form>
    </Card>
  );
}
