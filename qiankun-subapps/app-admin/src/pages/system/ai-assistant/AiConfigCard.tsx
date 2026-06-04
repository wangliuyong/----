import type { ReactNode } from 'react';
import AiConfigModal from './components/AiConfigModal';
import AiConfigStatusTags from './components/AiConfigStatusTags';
import {
  useAiConfig as useAiConfigState,
  type UseAiConfigOptions,
  type UseAiConfigResult,
} from './hooks/useAiConfig';

export type { UseAiConfigOptions, UseAiConfigResult };

/**
 * AI 配置组合：状态标签 + 配置弹窗（供数据配置管理页使用）。
 */
export function useAiConfigCard(options?: UseAiConfigOptions): UseAiConfigResult & {
  configStatus: ReactNode;
  modal: ReactNode;
} {
  const cfg = useAiConfigState(options);

  const configStatus = (
    <AiConfigStatusTags loading={cfg.loading} config={cfg.config} />
  );

  const modal = (
    <AiConfigModal
      open={cfg.modalOpen}
      saving={cfg.saving}
      loading={cfg.loading}
      config={cfg.config}
      form={cfg.form}
      isDashscope={cfg.isDashscope}
      dashscopeHint={cfg.dashscopeHint}
      chatModelOptions={cfg.chatModelOptions}
      embeddingModelOptions={cfg.embeddingModelOptions}
      onClose={cfg.closeModal}
      onSubmit={(v) => void cfg.handleSubmit(v)}
      onEmbeddingModelChange={cfg.handleEmbeddingModelChange}
      onBaseUrlChange={cfg.handleBaseUrlChange}
    />
  );

  return { ...cfg, configStatus, modal };
}

/** @deprecated 使用 useAiConfigCard，保留别名兼容 */
export const useAiConfig = useAiConfigCard;
