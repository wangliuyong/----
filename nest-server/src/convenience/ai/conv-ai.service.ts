import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  AIMessage,
  BaseMessage,
  HumanMessage,
  SystemMessage,
} from '@langchain/core/messages';
import { ChatOpenAI } from '@langchain/openai';
import { PrismaService } from '../../prisma/prisma.service';
import { AiConfigService } from '../../ai/services/ai-config.service';
import { serializeAiMessage, serializeAiSession } from '../common/serializers';
import { CONV_AI_SYSTEM_PROMPT } from './conv-ai.prompt';
import type { ConvAiChatDto } from './dto/conv-ai.dto';

/** 带入 LLM 的最大历史消息条数（user+assistant 合计） */
const MAX_HISTORY_MESSAGES = 20;

@Injectable()
export class ConvAiService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly aiConfig: AiConfigService,
  ) {}

  /** 查询用户 AI 会话列表 */
  async findSessions(userId: number) {
    const list = await this.prisma.convAiSession.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return list.map(serializeAiSession);
  }

  /** 查询会话消息 */
  async findMessages(userId: number, sessionId: number) {
    const session = await this.prisma.convAiSession.findFirst({
      where: { id: sessionId, userId },
    });
    if (!session) {
      throw new NotFoundException('会话不存在');
    }
    const messages = await this.prisma.convAiMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
    });
    return messages.map(serializeAiMessage);
  }

  /** AI 问答：调用管理后台配置的 LLM，结合会话历史生成回答 */
  async chat(userId: number, dto: ConvAiChatDto) {
    let sessionId = dto.sessionId;

    if (sessionId) {
      const session = await this.prisma.convAiSession.findFirst({
        where: { id: sessionId, userId },
      });
      if (!session) {
        throw new NotFoundException('会话不存在');
      }
    } else {
      const session = await this.prisma.convAiSession.create({
        data: {
          userId,
          title: dto.question.slice(0, 20),
        },
      });
      sessionId = session.id;
    }

    const answer = await this.generateAnswer(sessionId!, dto.question);
    const now = new Date();

    await this.prisma.convAiMessage.createMany({
      data: [
        {
          sessionId: sessionId!,
          role: 'user',
          content: dto.question,
          createdAt: now,
        },
        {
          sessionId: sessionId!,
          role: 'assistant',
          content: answer,
          createdAt: new Date(now.getTime() + 100),
        },
      ],
    });

    return { sessionId: sessionId!, answer };
  }

  /** 拉取平台动态上下文（公告摘要），注入 system 提示 */
  private async buildDynamicContext(): Promise<string> {
    const notices = await this.prisma.convNotice.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      take: 3,
      select: { title: true, content: true },
    });
    if (!notices.length) return '';

    const lines = notices.map(
      (n, i) => `${i + 1}. ${n.title}：${n.content.slice(0, 120)}`,
    );
    return `\n\n最新平台公告（回答时可参考）：\n${lines.join('\n')}`;
  }

  /** 组装 LLM 消息：system + 历史 + 当前问题 */
  private async buildMessages(
    sessionId: number,
    question: string,
  ): Promise<BaseMessage[]> {
    const dynamicContext = await this.buildDynamicContext();
    const messages: BaseMessage[] = [
      new SystemMessage(CONV_AI_SYSTEM_PROMPT + dynamicContext),
    ];

    const history = await this.prisma.convAiMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
      take: MAX_HISTORY_MESSAGES,
    });

    for (const item of history) {
      if (item.role === 'user') {
        messages.push(new HumanMessage(item.content));
      } else if (item.role === 'assistant') {
        messages.push(new AIMessage(item.content));
      }
    }

    messages.push(new HumanMessage(question));
    return messages;
  }

  /** 创建 ChatOpenAI 实例（复用管理后台 AiConfig 配置） */
  private async createLlm(): Promise<ChatOpenAI | null> {
    const config = await this.aiConfig.getResolvedConfig();
    if (!config) return null;

    return new ChatOpenAI({
      apiKey: config.apiKey,
      model: config.chatModel,
      temperature: 0.6,
      streaming: false,
      configuration: { baseURL: config.baseUrl },
    });
  }

  /** 调用 LLM 生成回答 */
  private async generateAnswer(
    sessionId: number,
    question: string,
  ): Promise<string> {
    const llm = await this.createLlm();
    if (!llm) {
      return 'AI 助手暂未配置。请管理员在后台「AI 小助手」中设置 API Key 后重试。';
    }

    try {
      const messages = await this.buildMessages(sessionId, question);
      const response = await llm.invoke(messages);
      const text = this.extractTextContent(response.content);
      return text.trim() || '抱歉，我暂时无法回答这个问题，请换个方式描述试试。';
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      throw new InternalServerErrorException(`AI 回答生成失败：${message}`);
    }
  }

  /** 解析 LangChain 消息 content（string 或 multimodal 数组） */
  private extractTextContent(content: unknown): string {
    if (typeof content === 'string') return content;
    if (Array.isArray(content)) {
      return content
        .map((part) => {
          if (typeof part === 'string') return part;
          if (part && typeof part === 'object' && 'text' in part) {
            return String((part as { text: string }).text);
          }
          return '';
        })
        .join('');
    }
    return String(content ?? '');
  }
}
