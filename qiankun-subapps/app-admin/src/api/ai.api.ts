import { request } from './client';

/** 可同步的数据源 */
export type AiDataSource = 'articles' | 'projects' | 'messages' | 'logs';

/** 同步勾选的一条数据源记录 */
export interface SyncItemPayload {
  source: AiDataSource;
  ids: string[];
}

/** 可向量化勾选的候选 */
export interface SyncCandidateItem {
  id: string;
  title: string;
  subtitle?: string;
}

/** 单数据源同步结果 */
export interface SourceSyncResult {
  source: AiDataSource;
  ids: string[];
  chunkCount: number;
  error?: string;
}

/** 同步响应 */
export interface AiSyncResponse {
  recordId: number;
  results: SourceSyncResult[];
  chunkCount: number;
}

/** 同步记录中的勾选明细 */
export interface AiSyncRecordItem {
  source: AiDataSource | string;
  ids: string[];
}

/** 同步记录 */
export interface AiSyncRecord {
  id: number;
  sources: AiSyncRecordItem[] | string[];
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

/** 获取某数据源下可向量化勾选的候选列表 */
export function getAiSyncCandidates(source: AiDataSource) {
  return request<SyncCandidateItem[]>(
    `/admin/ai/sync/candidates?source=${encodeURIComponent(source)}`,
  );
}

/** 按勾选记录触发向量化（非全表） */
export function syncAiItems(items: SyncItemPayload[]) {
  return request<AiSyncResponse>('/admin/ai/sync', {
    method: 'POST',
    body: JSON.stringify({ items }),
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

/** 用户问答会话列表项 */
export interface AiChatSessionItem {
  id: string;
  messageCount: number;
  firstQuestion: string;
  lastQuestion: string;
  lastReplyPreview: string;
  createdAt: string;
  updatedAt: string;
}

/** 用户问答消息 */
export interface AiChatMessageItem {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  error: string | null;
  createdAt: string;
}

/** 用户问答会话详情 */
export interface AiChatSessionDetail {
  id: string;
  messageCount: number;
  createdAt: string;
  updatedAt: string;
  messages: AiChatMessageItem[];
}

export interface AiChatSessionQuery {
  page?: number;
  pageSize?: number;
  keyword?: string;
}

export interface PaginatedAiChatSessions {
  items: AiChatSessionItem[];
  total: number;
  page: number;
  pageSize: number;
}

/** 用户问答会话分页列表 */
export function listAiChatSessions(query: AiChatSessionQuery = {}) {
  const params = new URLSearchParams();
  if (query.page) params.set('page', String(query.page));
  if (query.pageSize) params.set('pageSize', String(query.pageSize));
  if (query.keyword?.trim()) params.set('keyword', query.keyword.trim());
  const qs = params.toString();
  return request<PaginatedAiChatSessions>(
    `/admin/ai/qa/sessions${qs ? `?${qs}` : ''}`,
  );
}

/** 用户问答会话详情 */
export function getAiChatSession(id: string) {
  return request<AiChatSessionDetail>(
    `/admin/ai/qa/sessions/${encodeURIComponent(id)}`,
  );
}

/** 删除单条用户问答会话 */
export function deleteAiChatSession(id: string) {
  return request<{ deleted: number }>(
    `/admin/ai/qa/sessions/${encodeURIComponent(id)}`,
    { method: 'DELETE' },
  );
}

/** 批量删除用户问答会话 */
export function batchDeleteAiChatSessions(ids: string[]) {
  return request<{ deleted: number }>('/admin/ai/qa/sessions/batch-delete', {
    method: 'POST',
    body: JSON.stringify({ ids }),
  });
}
