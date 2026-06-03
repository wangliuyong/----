import { Alert, Button, Form, Input, InputNumber, Modal, Select, Tag, message } from 'antd';
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  AI_CONFIG_KEY_PLACEHOLDER,
  getAiConfig,
  updateAiConfig,
  type AiConfigResponse,
  type UpdateAiConfigPayload,
} from '../../../api/ai.api';
import PermissionGuard from '../../../components/PermissionGuard';
import {
  getChatModelOptions,
  getEmbeddingModelOptions,
  inferEmbeddingDimensions,
  isDashscopeBaseUrl,
  mergeCurrentModelOption,
} from './aiModelOptions';

interface AiConfigFormValues {
  openaiBaseUrl: string;
  openaiApiKey: string;
  openaiChatModel: string;
  openaiEmbeddingModel: string;
  embeddingDimensions: number;
}

/** 通义千问推荐配置（Base URL 含 dashscope 时表单提示） */
const DASHSCOPE_HINT = {
  chatModel: 'qwen-plus',
  embeddingModel: 'text-embedding-v3',
  dimensions: 1024,
};

export interface UseAiConfigOptions {
  /** 配置保存成功后的回调（如刷新页面统计） */
  onSaved?: () => void;
}

export interface UseAiConfigResult {
  /** 打开配置弹窗（会拉取最新配置） */
  open: () => void;
  /** 是否正在加载配置 */
  loading: boolean;
  /** 配置弹窗是否已打开 */
  modalOpen: boolean;
  /** 配置状态标签（可放在标题栏 extra） */
  configStatus: ReactNode;
  /** 配置弹窗节点，渲染在页面任意位置 */
  modal: ReactNode;
}

/**
 * AI 服务配置逻辑：弹窗编辑 API Key、Base URL、对话/向量模型及维度，保存成功后关闭弹窗。
 */
export function useAiConfig({ onSaved }: UseAiConfigOptions = {}): UseAiConfigResult {
  const [form] = Form.useForm<AiConfigFormValues>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [config, setConfig] = useState<AiConfigResponse | null>(null);

  /** 将接口配置写入表单 */
  const applyConfigToForm = useCallback(
    (data: AiConfigResponse) => {
      form.setFieldsValue({
        openaiBaseUrl: data.openaiBaseUrl,
        openaiApiKey: data.hasApiKey ? AI_CONFIG_KEY_PLACEHOLDER : '',
        openaiChatModel: data.openaiChatModel,
        openaiEmbeddingModel: data.openaiEmbeddingModel,
        embeddingDimensions: data.embeddingDimensions,
      });
    },
    [form],
  );

  /** 拉取最新配置（页面初始化与打开弹窗时） */
  const fetchConfig = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAiConfig();
      setConfig(data);
      applyConfigToForm(data);
      return data;
    } finally {
      setLoading(false);
    }
  }, [applyConfigToForm]);

  useEffect(() => {
    void fetchConfig();
  }, [fetchConfig]);

  /** 打开弹窗时刷新配置，保证编辑内容为最新 */
  const open = useCallback(() => {
    setModalOpen(true);
    void fetchConfig();
  }, [fetchConfig]);

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
      applyConfigToForm(next);
      message.success('AI 配置已保存');
      setModalOpen(false);
      onSaved?.();
    } finally {
      setSaving(false);
    }
  };

  const baseUrl = Form.useWatch('openaiBaseUrl', form) ?? config?.openaiBaseUrl ?? '';
  const chatModel = Form.useWatch('openaiChatModel', form) ?? config?.openaiChatModel;
  const embeddingModel =
    Form.useWatch('openaiEmbeddingModel', form) ?? config?.openaiEmbeddingModel;
  const isDashscope = isDashscopeBaseUrl(baseUrl);

  const chatModelOptions = useMemo(
    () => mergeCurrentModelOption(getChatModelOptions(baseUrl), chatModel),
    [baseUrl, chatModel],
  );

  const embeddingModelOptions = useMemo(
    () => mergeCurrentModelOption(getEmbeddingModelOptions(baseUrl), embeddingModel),
    [baseUrl, embeddingModel],
  );

  /** 切换向量模型时同步推荐维度 */
  const handleEmbeddingModelChange = (model: string) => {
    form.setFieldValue('embeddingDimensions', inferEmbeddingDimensions(model));
  };

  /** 切换 Base URL 后若当前模型不在新列表中，重置为对应服务商默认项 */
  const handleBaseUrlChange = (url: string) => {
    const chatOpts = getChatModelOptions(url);
    const embedOpts = getEmbeddingModelOptions(url);
    const curChat = form.getFieldValue('openaiChatModel') as string | undefined;
    const curEmbed = form.getFieldValue('openaiEmbeddingModel') as string | undefined;
    const patch: Partial<AiConfigFormValues> = {};
    if (curChat && !chatOpts.some((o) => o.value === curChat)) {
      patch.openaiChatModel = chatOpts[0]?.value;
    }
    if (curEmbed && !embedOpts.some((o) => o.value === curEmbed)) {
      patch.openaiEmbeddingModel = embedOpts[0]?.value;
      patch.embeddingDimensions = inferEmbeddingDimensions(embedOpts[0]?.value ?? '');
    }
    if (Object.keys(patch).length) {
      form.setFieldsValue(patch);
    }
  };

  const configStatus = (
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

  const modal = (
    <Modal
      title="AI 服务配置"
      open={modalOpen}
      onCancel={() => !saving && setModalOpen(false)}
      width={560}
      destroyOnClose={false}
      footer={
        <>
          <Button onClick={() => setModalOpen(false)} disabled={saving}>
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
          description={`对话模型：${DASHSCOPE_HINT.chatModel}；向量模型：${DASHSCOPE_HINT.embeddingModel}；向量维度：${DASHSCOPE_HINT.dimensions}`}
          style={{ marginBottom: 16 }}
        />
      )}

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="OPENAI_BASE_URL"
          name="openaiBaseUrl"
          rules={[{ required: true, message: '请输入 API Base URL' }]}
          extra="通义千问：https://dashscope.aliyuncs.com/compatible-mode/v1"
        >
          <Input
            placeholder="https://api.openai.com/v1"
            onBlur={(e) => handleBaseUrlChange(e.target.value.trim())}
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
          extra={isDashscope ? '通义向量模型，切换后自动更新推荐维度' : 'OpenAI 向量模型，切换后自动更新推荐维度'}
        >
          <Select
            options={embeddingModelOptions}
            placeholder="请选择向量模型"
            showSearch
            optionFilterProp="label"
            onChange={handleEmbeddingModelChange}
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

  return { open, loading, modalOpen, configStatus, modal };
}
