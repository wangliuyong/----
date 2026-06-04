import { Form, message } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AI_CONFIG_KEY_PLACEHOLDER,
  getAiConfig,
  updateAiConfig,
  type AiConfigResponse,
  type UpdateAiConfigPayload,
} from '../../../../api/ai.api';
import {
  getChatModelOptions,
  getEmbeddingModelOptions,
  inferEmbeddingDimensions,
  isDashscopeBaseUrl,
  mergeCurrentModelOption,
} from '../aiModelOptions';

interface AiConfigFormValues {
  openaiBaseUrl: string;
  openaiApiKey: string;
  openaiChatModel: string;
  openaiEmbeddingModel: string;
  embeddingDimensions: number;
}

/** 通义千问推荐配置提示文案 */
const DASHSCOPE_HINT = {
  chatModel: 'qwen-plus',
  embeddingModel: 'text-embedding-v3',
  dimensions: 1024,
};

export interface UseAiConfigOptions {
  onSaved?: () => void;
}

export interface UseAiConfigResult {
  open: () => void;
  loading: boolean;
  saving: boolean;
  modalOpen: boolean;
  config: AiConfigResponse | null;
  form: ReturnType<typeof Form.useForm<AiConfigFormValues>>[0];
  isDashscope: boolean;
  dashscopeHint: typeof DASHSCOPE_HINT;
  chatModelOptions: ReturnType<typeof getChatModelOptions>;
  embeddingModelOptions: ReturnType<typeof getEmbeddingModelOptions>;
  handleSubmit: (values: AiConfigFormValues) => Promise<void>;
  handleEmbeddingModelChange: (model: string) => void;
  handleBaseUrlChange: (url: string) => void;
  closeModal: () => void;
}

/**
 * AI 服务配置：拉取/保存 API Key、模型与向量维度。
 */
export function useAiConfig({ onSaved }: UseAiConfigOptions = {}): UseAiConfigResult {
  const [form] = Form.useForm<AiConfigFormValues>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [config, setConfig] = useState<AiConfigResponse | null>(null);

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

  const handleEmbeddingModelChange = (model: string) => {
    form.setFieldValue('embeddingDimensions', inferEmbeddingDimensions(model));
  };

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

  return {
    open,
    loading,
    saving,
    modalOpen,
    config,
    form,
    isDashscope,
    dashscopeHint: DASHSCOPE_HINT,
    chatModelOptions,
    embeddingModelOptions,
    handleSubmit,
    handleEmbeddingModelChange,
    handleBaseUrlChange,
    closeModal: () => setModalOpen(false),
  };
}
