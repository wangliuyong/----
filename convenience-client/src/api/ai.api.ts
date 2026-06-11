import { request } from './client';
import {
  mockState,
  mockDelay,
  mockKnowledgeSnippets,
} from '@/mock/data';
import { useMock } from '@/utils/platform';
import type { AiChatPayload, AiChatResult, AiMessageItem, AiSessionItem } from '@/types/city-info';

/** 根据问题检索 Mock 知识库片段 */
function retrieveKnowledge(question: string): string {
  const keys = Object.keys(mockKnowledgeSnippets);
  const hit = keys.find((k) => k !== '默认' && question.includes(k));
  return mockKnowledgeSnippets[hit || '默认'];
}

/** 生成 Mock 回答（模拟 RAG + LLM） */
function buildMockAnswer(question: string): string {
  const snippet = retrieveKnowledge(question);
  return `【便民知识库】${snippet}\n\n针对您的问题「${question}」，如需进一步帮助可联系平台客服。`;
}

/** 查询 AI 会话列表 */
export async function queryAiSessions(): Promise<AiSessionItem[]> {
  if (useMock()) {
    await mockDelay(200);
    return [...mockState.aiSessions].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }
  return request<AiSessionItem[]>('/ai/sessions');
}

/** 查询会话消息 */
export async function queryAiMessages(sessionId: number): Promise<AiMessageItem[]> {
  if (useMock()) {
    await mockDelay(200);
    return mockState.aiMessages
      .filter((m) => m.sessionId === sessionId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }
  return request<AiMessageItem[]>(`/ai/sessions/${sessionId}/messages`);
}

/** AI 问答（非流式兜底） */
export async function postAiChat(payload: AiChatPayload): Promise<AiChatResult> {
  if (useMock()) {
    await mockDelay(500);
    let sessionId = payload.sessionId;
    if (!sessionId) {
      mockState.aiSessionId += 1;
      sessionId = mockState.aiSessionId;
      mockState.aiSessions.unshift({
        id: sessionId,
        userId: 1,
        title: payload.question.slice(0, 20),
        createdAt: new Date().toISOString(),
      });
    }
    const now = new Date().toISOString();
    mockState.aiMessageId += 1;
    mockState.aiMessages.push({
      id: mockState.aiMessageId,
      sessionId,
      role: 'user',
      content: payload.question,
      createdAt: now,
    });
    const answer = buildMockAnswer(payload.question);
    mockState.aiMessageId += 1;
    mockState.aiMessages.push({
      id: mockState.aiMessageId,
      sessionId,
      role: 'assistant',
      content: answer,
      createdAt: new Date().toISOString(),
    });
    return { sessionId, answer };
  }
  return request<AiChatResult>('/ai/chat', { method: 'POST', data: payload });
}

/**
 * Mock 流式输出（打字机效果）
 * 真实对接时可替换为 SSE / chunked 请求
 */
export async function* streamAiChat(payload: AiChatPayload): AsyncGenerator<string, AiChatResult> {
  if (useMock()) {
    const result = await postAiChat(payload);
    const chars = result.answer.split('');
    for (const ch of chars) {
      await mockDelay(30);
      yield ch;
    }
    return result;
  }

  const result = await postAiChat(payload);
  yield result.answer;
  return result;
}

/** Mock 图片上传 */
export async function postUploadImage(filePath: string): Promise<{ url: string }> {
  if (useMock()) {
    await mockDelay(400);
    return { url: filePath };
  }
  const { uploadFile } = await import('./client');
  return uploadFile(filePath);
}
