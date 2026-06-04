import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

/** 管理端列表项：会话摘要 */
export interface AiChatSessionListItem {
  id: string;
  messageCount: number;
  /** 首条用户问题预览 */
  firstQuestion: string;
  /** 最近一条用户问题预览 */
  lastQuestion: string;
  /** 最近一条助手回复预览 */
  lastReplyPreview: string;
  createdAt: string;
  updatedAt: string;
}

/** 管理端详情：完整对话 */
export interface AiChatSessionDetail {
  id: string;
  messageCount: number;
  createdAt: string;
  updatedAt: string;
  messages: {
    id: number;
    role: 'user' | 'assistant';
    content: string;
    error: string | null;
    createdAt: string;
  }[];
}

const PREVIEW_LEN = 120;

/** 截取文本预览，超出以省略号结尾 */
function preview(text: string, max = PREVIEW_LEN): string {
  const trimmed = text.trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max)}…`;
}

/**
 * AI 用户问答持久化：前台每次问答写入 SQLite，供管理端审计与删除。
 * 与 LangGraph MemorySaver 独立——前者进程内短期记忆，后者长期落库。
 */
@Injectable()
export class AiChatLogService {
  constructor(private readonly prisma: PrismaService) {}

  /** 确保会话存在（首次提问时 upsert） */
  async ensureSession(sessionId: string): Promise<void> {
    await this.prisma.aiChatSession.upsert({
      where: { id: sessionId },
      create: { id: sessionId },
      update: {},
    });
  }

  /** 记录用户提问 */
  async recordUserMessage(sessionId: string, content: string): Promise<void> {
    const text = content.trim();
    if (!text) return;

    await this.ensureSession(sessionId);
    await this.prisma.$transaction([
      this.prisma.aiChatMessage.create({
        data: { sessionId, role: 'user', content: text },
      }),
      this.prisma.aiChatSession.update({
        where: { id: sessionId },
        data: { messageCount: { increment: 1 }, updatedAt: new Date() },
      }),
    ]);
  }

  /** 记录助手回复（含失败时的 error 字段） */
  async recordAssistantMessage(
    sessionId: string,
    content: string,
    error?: string | null,
  ): Promise<void> {
    await this.ensureSession(sessionId);
    await this.prisma.$transaction([
      this.prisma.aiChatMessage.create({
        data: {
          sessionId,
          role: 'assistant',
          content: content.trim(),
          error: error?.trim() || null,
        },
      }),
      this.prisma.aiChatSession.update({
        where: { id: sessionId },
        data: { messageCount: { increment: 1 }, updatedAt: new Date() },
      }),
    ]);
  }

  /** 分页列出会话（按最近活跃排序） */
  async listSessions(query: {
    page?: number;
    pageSize?: number;
    keyword?: string;
  }): Promise<{
    items: AiChatSessionListItem[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const keyword = query.keyword?.trim();

    const where = keyword
      ? {
          OR: [
            { id: { contains: keyword } },
            {
              messages: {
                some: { content: { contains: keyword } },
              },
            },
          ],
        }
      : undefined;

    const [total, sessions] = await Promise.all([
      this.prisma.aiChatSession.count({ where }),
      this.prisma.aiChatSession.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
          },
        },
      }),
    ]);

    const items: AiChatSessionListItem[] = sessions.map((s) => {
      const userMessages = s.messages.filter((m) => m.role === 'user');
      const assistantMessages = s.messages.filter((m) => m.role === 'assistant');
      const firstUser = userMessages[0]?.content ?? '';
      const lastUser = userMessages[userMessages.length - 1]?.content ?? '';
      const lastAssistant =
        assistantMessages[assistantMessages.length - 1]?.content ?? '';

      return {
        id: s.id,
        messageCount: s.messageCount,
        firstQuestion: preview(firstUser),
        lastQuestion: preview(lastUser),
        lastReplyPreview: preview(lastAssistant),
        createdAt: s.createdAt.toISOString(),
        updatedAt: s.updatedAt.toISOString(),
      };
    });

    return { items, total, page, pageSize };
  }

  /** 会话详情（含全部消息） */
  async getSessionDetail(sessionId: string): Promise<AiChatSessionDetail> {
    const session = await this.prisma.aiChatSession.findUnique({
      where: { id: sessionId },
      include: {
        messages: { orderBy: { createdAt: 'asc' } },
      },
    });

    if (!session) {
      throw new NotFoundException('会话不存在');
    }

    return {
      id: session.id,
      messageCount: session.messageCount,
      createdAt: session.createdAt.toISOString(),
      updatedAt: session.updatedAt.toISOString(),
      messages: session.messages.map((m) => ({
        id: m.id,
        role: m.role as 'user' | 'assistant',
        content: m.content,
        error: m.error,
        createdAt: m.createdAt.toISOString(),
      })),
    };
  }

  /** 删除单个会话（级联删除消息） */
  async deleteSession(sessionId: string): Promise<number> {
    try {
      await this.prisma.aiChatSession.delete({ where: { id: sessionId } });
      return 1;
    } catch {
      return 0;
    }
  }

  /** 批量删除会话 */
  async deleteSessions(ids: string[]): Promise<number> {
    const result = await this.prisma.aiChatSession.deleteMany({
      where: { id: { in: ids } },
    });
    return result.count;
  }
}
