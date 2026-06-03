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

/** 知识库向量块列表项 */
export interface KnowledgeChunkItem {
  id: string;
  source: AiDataSource | string;
  sourceId: string;
  title: string;
  slug: string;
  textPreview: string;
  textLength: number;
}

/** 知识库向量块详情 */
export interface KnowledgeChunkDetail extends KnowledgeChunkItem {
  text: string;
}

export interface KnowledgeChunkQuery {
  page?: number;
  pageSize?: number;
  source?: AiDataSource;
  keyword?: string;
}

export interface PaginatedKnowledgeChunks {
  items: KnowledgeChunkItem[];
  total: number;
  page: number;
  pageSize: number;
}

/** 知识库向量块分页列表 */
export function listKnowledgeChunks(query: KnowledgeChunkQuery = {}) {
  const params = new URLSearchParams();
  if (query.page) params.set('page', String(query.page));
  if (query.pageSize) params.set('pageSize', String(query.pageSize));
  if (query.source) params.set('source', query.source);
  if (query.keyword?.trim()) params.set('keyword', query.keyword.trim());
  const qs = params.toString();
  return request<PaginatedKnowledgeChunks>(
    `/admin/ai/knowledge/chunks${qs ? `?${qs}` : ''}`,
  );
}

/** 知识库单条详情 */
export function getKnowledgeChunk(id: string) {
  return request<KnowledgeChunkDetail>(
    `/admin/ai/knowledge/chunks/${encodeURIComponent(id)}`,
  );
}

/** 删除单条向量块 */
export function deleteKnowledgeChunk(id: string) {
  return request<{ deleted: number }>(
    `/admin/ai/knowledge/chunks/${encodeURIComponent(id)}`,
    { method: 'DELETE' },
  );
}

/** 批量删除向量块 */
export function batchDeleteKnowledgeChunks(ids: string[]) {
  return request<{ deleted: number }>('/admin/ai/knowledge/chunks/batch-delete', {
    method: 'POST',
    body: JSON.stringify({ ids }),
  });
}
