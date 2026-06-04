import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage } from '@langchain/core/messages';
import { createAgent, type ReactAgent } from 'langchain';
import { createGenerateChartTool } from '../tools/generate-chart.tool';
import { createFormatCodeTool } from '../tools/format-code.tool';
import { createSearchKnowledgeTool } from '../tools/search-knowledge.tool';
import { AiChatLogService } from './ai-chat-log.service';
import { AiChatMemoryService } from './ai-chat-memory.service';
import { AiConfigService } from './ai-config.service';
import { AiVectorStoreService } from './ai-vector-store.service';

/** SSE 事件类型 */
export type AiChatEvent =
  | { type: 'session'; sessionId: string }
  | { type: 'token'; content: string }
  | { type: 'tool_start'; name: string }
  | { type: 'tool_result'; name: string; content: string }
  | { type: 'done' }
  | { type: 'error'; message: string };

const SYSTEM_PROMPT = `你是「王刘永的个人站点」AI 小助手，负责回答访客关于博客、项目、留言与站点运营的问题。

规则：
1. 回答站点内容相关问题时，必须先调用 search_knowledge_base 检索知识库，基于检索结果回答，并注明信息来源。
2. 用户要求可视化、统计、图表时，调用 generate_chart 工具生成图表。
3. 用户要求展示或格式化代码时，调用 format_code 工具。
4. 检索无结果时诚实说明，不要编造内容。
5. 使用简洁、友好的中文回答。
6. 同一会话内可看到历史消息，请结合上下文连贯作答，避免重复询问用户已提供的信息。`;

type CachedAgent = {
  key: string;
  agent: ReactAgent;
};

/**
 * LangChain Agent 编排与 SSE 流式输出；通过 MemorySaver + thread_id 实现多轮记忆。
 */
@Injectable()
export class AiChatService {
  private cachedAgent: CachedAgent | null = null;

  constructor(
    private readonly vectorStore: AiVectorStoreService,
    private readonly aiConfig: AiConfigService,
    private readonly chatMemory: AiChatMemoryService,
    private readonly chatLog: AiChatLogService,
  ) {}

  /** 规范化会话 ID，无效时生成新 UUID */
  resolveSessionId(sessionId?: string): string {
    const id = sessionId?.trim();
    if (id && id.length <= 128 && /^[\w-]+$/.test(id)) {
      return id;
    }
    return randomUUID();
  }

  /** 清除会话记忆（LangGraph deleteThread） */
  async clearSession(sessionId: string): Promise<void> {
    await this.chatMemory.clearThread(this.resolveSessionId(sessionId));
  }

  /** 流式聊天：yield SSE 事件；同一 sessionId 自动带上历史上下文 */
  async *streamChat(
    userMessage: string,
    sessionId?: string,
  ): AsyncGenerator<AiChatEvent> {
    const threadId = this.resolveSessionId(sessionId);
    let assistantContent = '';
    let streamError: string | null = null;

    try {
      yield { type: 'session', sessionId: threadId };

      // 落库用户提问（与 LangGraph 记忆并行，供管理端审计）
      await this.chatLog.recordUserMessage(threadId, userMessage);

      const agent = await this.getOrCreateAgent();
      if (!agent) {
        streamError = 'AI 服务未配置，请在管理后台设置 OPENAI_API_KEY';
        yield { type: 'error', message: streamError };
        await this.chatLog.recordAssistantMessage(threadId, '', streamError);
        return;
      }

      const stream = await agent.stream(
        { messages: [new HumanMessage(userMessage)] },
        { configurable: { thread_id: threadId } },
      );

      for await (const chunk of stream) {
        const events = this.parseStreamChunk(chunk);
        for (const event of events) {
          if (event.type === 'token') {
            assistantContent += event.content;
          }
          if (event.type === 'error') {
            streamError = event.message;
          }
          yield event;
        }
      }

      yield { type: 'done' };
      await this.chatLog.recordAssistantMessage(threadId, assistantContent, streamError);
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      await this.chatLog.recordAssistantMessage(threadId, assistantContent, message);
      yield { type: 'error', message };
    }
  }

  /**
   * 按当前 AI 配置构建或复用 Agent；checkpointer 使用 LangChain MemorySaver。
   */
  private async getOrCreateAgent(): Promise<ReactAgent | null> {
    const resolved = await this.aiConfig.getResolvedConfig();
    if (!resolved) return null;

    const cacheKey = `${resolved.baseUrl}|${resolved.chatModel}`;
    if (this.cachedAgent?.key === cacheKey) {
      return this.cachedAgent.agent;
    }

    const llm = new ChatOpenAI({
      apiKey: resolved.apiKey,
      model: resolved.chatModel,
      temperature: 0.3,
      streaming: true,
      configuration: { baseURL: resolved.baseUrl },
    });

    const tools = [
      createSearchKnowledgeTool(this.vectorStore),
      createGenerateChartTool(),
      createFormatCodeTool(),
    ];

    const agent = createAgent({
      model: llm,
      tools,
      systemPrompt: SYSTEM_PROMPT,
      checkpointer: this.chatMemory.getCheckpointer(),
    });

    this.cachedAgent = { key: cacheKey, agent };
    return agent;
  }

  /** 解析 Agent 流式 chunk 为 SSE 事件 */
  private parseStreamChunk(chunk: unknown): AiChatEvent[] {
    const events: AiChatEvent[] = [];
    if (!chunk || typeof chunk !== 'object') return events;

    const record = chunk as Record<string, unknown>;

    /** LangGraph stream 可能按 node 分组 */
    for (const nodeOutput of Object.values(record)) {
      if (!nodeOutput || typeof nodeOutput !== 'object') continue;
      const output = nodeOutput as { messages?: unknown[] };
      if (!Array.isArray(output.messages)) continue;

      for (const msg of output.messages) {
        if (!msg || typeof msg !== 'object') continue;
        const m = msg as {
          content?: string | unknown[];
          tool_calls?: Array<{ name: string; id: string }>;
          name?: string;
          _getType?: () => string;
          getType?: () => string;
        };

        const msgType =
          typeof m.getType === 'function'
            ? m.getType()
            : typeof m._getType === 'function'
              ? m._getType()
              : '';

        /** AI 文本 token */
        if (msgType === 'ai' || msgType === 'AIMessageChunk') {
          const content = m.content;
          if (typeof content === 'string' && content) {
            events.push({ type: 'token', content });
          } else if (Array.isArray(content)) {
            for (const part of content) {
              if (
                part &&
                typeof part === 'object' &&
                'text' in part &&
                typeof (part as { text: string }).text === 'string'
              ) {
                events.push({ type: 'token', content: (part as { text: string }).text });
              }
            }
          }
          if (m.tool_calls?.length) {
            for (const tc of m.tool_calls) {
              events.push({ type: 'tool_start', name: tc.name });
            }
          }
        }

        /** 工具返回结果 */
        if (msgType === 'tool' || msgType === 'ToolMessage') {
          const toolName = m.name ?? 'tool';
          const content =
            typeof m.content === 'string' ? m.content : JSON.stringify(m.content ?? '');
          events.push({ type: 'tool_result', name: toolName, content });
        }
      }
    }

    return events;
  }
}
