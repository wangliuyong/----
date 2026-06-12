import { request, uploadFile } from './client';
import { resolveMediaUrl } from '@/utils/media';
import type { AiChatPayload, AiChatResult, AiMessageItem, AiSessionItem } from '@/types/city-info';

/** 查询 AI 会话列表 */
export function queryAiSessions(): Promise<AiSessionItem[]> {
  return request<AiSessionItem[]>('/ai/sessions');
}

/** 查询会话消息 */
export function queryAiMessages(sessionId: number): Promise<AiMessageItem[]> {
  return request<AiMessageItem[]>(`/ai/sessions/${sessionId}/messages`);
}

/** AI 问答（非流式） */
export function postAiChat(payload: AiChatPayload): Promise<AiChatResult> {
  return request<AiChatResult>('/ai/chat', { method: 'POST', data: payload });
}

/**
 * 流式输出（打字机效果）
 * 后端为非流式 JSON，获取完整回答后逐字展示
 */
export async function* streamAiChat(payload: AiChatPayload): AsyncGenerator<string, AiChatResult> {
  const result = await postAiChat(payload);
  for (const ch of result.answer) {
    yield ch;
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
  return result;
}

/** 图片上传（服务端入库，返回可访问 URL） */
export async function postUploadImage(filePath: string): Promise<{ url: string }> {
  const res = await uploadFile(filePath);
  return { url: resolveMediaUrl(res.url) };
}
