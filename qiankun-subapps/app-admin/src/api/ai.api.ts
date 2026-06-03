import { request } from './client';

/** 可同步的数据源 */
export type AiDataSource = 'articles' | 'projects' | 'messages' | 'logs';

/** 单数据源同步结果 */
export interface SourceSyncResult {
  source: AiDataSource;
  chunkCount: number;
  error?: string;
}

/** 同步响应 */
export interface AiSyncResponse {
  recordId: number;
  results: SourceSyncResult[];
  chunkCount: number;
}

/** 同步记录 */
export interface AiSyncRecord {
  id: number;
  sources: string[];
  status: string;
  chunkCount: number;
  error: string | null;
  startedAt: string;
  finishedAt: string | null;
}

/** 向量统计 */
export interface AiStatsResponse {
  vectorStats: Record<string, number>;
  configured: boolean;
}

/** AI 配置（管理端，Key 脱敏） */
export interface AiConfigResponse {
  openaiBaseUrl: string;
  openaiChatModel: string;
  openaiEmbeddingModel: string;
  embeddingDimensions: number;
  hasApiKey: boolean;
  apiKeyMasked: string | null;
  fromEnv: boolean;
}

/** 更新 AI 配置请求 */
export interface UpdateAiConfigPayload {
  openaiBaseUrl?: string;
  openaiApiKey?: string;
  openaiChatModel?: string;
  openaiEmbeddingModel?: string;
  embeddingDimensions?: number;
}

/** 表单中「不修改 Key」的占位符，与后端一致 */
export const AI_CONFIG_KEY_PLACEHOLDER = '********';

/** 数据源选项（管理页多选） */
export const AI_SOURCE_OPTIONS: { label: string; value: AiDataSource }[] = [
  { label: '博客', value: 'articles' },
  { label: '项目', value: 'projects' },
  { label: '留言', value: 'messages' },
  { label: '系统日志', value: 'logs' },
];

/** 触发多选数据源同步 */
export function syncAiSources(sources: AiDataSource[]) {
  return request<AiSyncResponse>('/admin/ai/sync', {
    method: 'POST',
    body: JSON.stringify({ sources }),
  });
}

/** 最近同步记录 */
export function getAiSyncStatus() {
  return request<AiSyncRecord[]>('/admin/ai/sync/status');
}

/** 向量库统计 */
export function getAiStats() {
  return request<AiStatsResponse>('/admin/ai/stats');
}

/** 读取 AI 配置 */
export function getAiConfig() {
  return request<AiConfigResponse>('/admin/ai/config');
}

/** 保存 AI 配置 */
export function updateAiConfig(payload: UpdateAiConfigPayload) {
  return request<AiConfigResponse>('/admin/ai/config', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}
