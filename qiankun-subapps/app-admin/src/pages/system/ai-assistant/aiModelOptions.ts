/** 下拉选项：value 为 API 模型名，label 为展示文案 */

export interface AiModelOption {
  value: string;
  label: string;
}

/** 通义千问（dashscope 兼容接口）对话模型 */
export const DASHSCOPE_CHAT_MODEL_OPTIONS: AiModelOption[] = [
  { value: 'qwen-plus', label: 'qwen-plus（推荐）' },
  { value: 'qwen-turbo', label: 'qwen-turbo' },
  { value: 'qwen-max', label: 'qwen-max' },
  { value: 'qwen-long', label: 'qwen-long' },
];

/** OpenAI 兼容接口对话模型 */
export const OPENAI_CHAT_MODEL_OPTIONS: AiModelOption[] = [
  { value: 'gpt-4o-mini', label: 'gpt-4o-mini（推荐）' },
  { value: 'gpt-4o', label: 'gpt-4o' },
  { value: 'gpt-4-turbo', label: 'gpt-4-turbo' },
  { value: 'gpt-3.5-turbo', label: 'gpt-3.5-turbo' },
];

/** 通义千问向量模型 */
export const DASHSCOPE_EMBEDDING_MODEL_OPTIONS: AiModelOption[] = [
  { value: 'text-embedding-v3', label: 'text-embedding-v3（推荐，1024 维）' },
  { value: 'text-embedding-v4', label: 'text-embedding-v4（1024 维）' },
];

/** OpenAI 向量模型 */
export const OPENAI_EMBEDDING_MODEL_OPTIONS: AiModelOption[] = [
  { value: 'text-embedding-3-small', label: 'text-embedding-3-small（推荐，1536 维）' },
  { value: 'text-embedding-3-large', label: 'text-embedding-3-large' },
  { value: 'text-embedding-ada-002', label: 'text-embedding-ada-002（1536 维）' },
];

/** 根据 Base URL 判断是否为通义 dashscope */
export function isDashscopeBaseUrl(baseUrl: string): boolean {
  return baseUrl.includes('dashscope');
}

/** 按服务商返回对话 / 向量模型选项 */
export function getChatModelOptions(baseUrl: string): AiModelOption[] {
  return isDashscopeBaseUrl(baseUrl) ? DASHSCOPE_CHAT_MODEL_OPTIONS : OPENAI_CHAT_MODEL_OPTIONS;
}

export function getEmbeddingModelOptions(baseUrl: string): AiModelOption[] {
  return isDashscopeBaseUrl(baseUrl)
    ? DASHSCOPE_EMBEDDING_MODEL_OPTIONS
    : OPENAI_EMBEDDING_MODEL_OPTIONS;
}

/**
 * 若当前已保存的模型不在预设列表中，追加一项以便下拉框能正确回显。
 */
export function mergeCurrentModelOption(
  options: AiModelOption[],
  current?: string | null,
): AiModelOption[] {
  const value = current?.trim();
  if (!value || options.some((o) => o.value === value)) {
    return options;
  }
  return [{ value, label: `${value}（当前配置）` }, ...options];
}

/** 根据 embedding 模型推断默认向量维度（与后端 inferEmbeddingDimensions 一致） */
export function inferEmbeddingDimensions(model: string): number {
  const m = model.toLowerCase();
  if (m.includes('text-embedding-v3') || m.includes('text-embedding-v4')) return 1024;
  if (m.includes('text-embedding-3') || m.includes('text-embedding-ada')) return 1536;
  return 1536;
}
