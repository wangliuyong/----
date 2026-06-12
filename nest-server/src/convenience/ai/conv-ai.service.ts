import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { serializeAiMessage, serializeAiSession } from '../common/serializers';
import type { ConvAiChatDto } from './dto/conv-ai.dto';

/** 便民 AI 知识库片段（模拟 RAG 检索） */
const KNOWLEDGE_SNIPPETS: Record<string, string> = {
  发布:
    '发布流程：底部 Tab「发布」→ 选择分类 → 填写标题与内容 → 上传图片（最多 6 张）→ 提交审核。审核通过后展示在首页和列表。',
  审核:
    '一般 1-2 个工作日完成审核。暑期兼职类优先，约 4 小时。可在「我的」查看状态：待审核、已通过、已驳回。',
  举报:
    '详情页点击「举报」，选择类型并填写说明。平台 24 小时内处理，严重违规立即下架。',
  收藏:
    '登录后可在详情页点击「收藏」，在「我的 - 我的收藏」中查看。取消收藏同样在该页面操作。',
  分类:
    '平台分三大板块：二手交易、求职招聘、上门服务。每类下有细分子分类，可在「分类」Tab 浏览。',
  价格:
    '二手类建议填写心理价位；招聘类可填月薪或日薪；服务类可填起步价或单价，方便用户筛选。',
  定位:
    '发布时填写地址有助于同城展示和距离排序。列表页支持按距离、价格、最新排序。',
  默认:
    '我是同城便民 AI 助手，可解答发布流程、审核规则、举报与分类等问题。请直接描述您的需求。',
};

@Injectable()
export class ConvAiService {
  constructor(private readonly prisma: PrismaService) {}

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

  /** 模拟 RAG 检索知识片段 */
  private retrieveKnowledge(question: string): string {
    const hit = Object.keys(KNOWLEDGE_SNIPPETS).find(
      (key) => key !== '默认' && question.includes(key),
    );
    return KNOWLEDGE_SNIPPETS[hit || '默认'];
  }

  /** 生成 Mock 回答 */
  private buildAnswer(question: string): string {
    const snippet = this.retrieveKnowledge(question);
    return `【便民知识库】${snippet}\n\n针对您的问题「${question}」，如需进一步帮助可联系平台客服。`;
  }

  /** AI 问答（非流式） */
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

    const now = new Date();
    const answer = this.buildAnswer(dto.question);

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
}
