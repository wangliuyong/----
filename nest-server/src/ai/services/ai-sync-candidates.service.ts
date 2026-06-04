import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { AiDataSource } from '../dto/sync.dto';

/** 同步候选条目（管理端勾选） */
export interface SyncCandidateItem {
  /** 提交同步时使用的 id：数字字符串或 audit:{id} / app:{id} */
  id: string;
  title: string;
  subtitle?: string;
}

/**
 * 列出可向量化勾选的候选数据，供管理端按条选择，避免默认全表同步。
 */
@Injectable()
export class AiSyncCandidatesService {
  constructor(private readonly prisma: PrismaService) {}

  async listBySource(source: AiDataSource): Promise<SyncCandidateItem[]> {
    switch (source) {
      case 'articles': {
        const rows = await this.prisma.article.findMany({
          orderBy: { publishedAt: 'desc' },
          select: { id: true, title: true, category: true, publishedAt: true },
        });
        return rows.map((r) => ({
          id: String(r.id),
          title: r.title,
          subtitle: [r.category, r.publishedAt.toLocaleDateString('zh-CN')]
            .filter(Boolean)
            .join(' · '),
        }));
      }
      case 'projects': {
        const rows = await this.prisma.project.findMany({
          orderBy: { id: 'desc' },
          select: { id: true, name: true, techStack: true },
        });
        return rows.map((r) => ({
          id: String(r.id),
          title: r.name,
          subtitle: r.techStack ?? undefined,
        }));
      }
      case 'messages': {
        const rows = await this.prisma.message.findMany({
          orderBy: { createdAt: 'desc' },
          select: { id: true, nickname: true, content: true, createdAt: true },
        });
        return rows.map((r) => ({
          id: String(r.id),
          title: `留言 · ${r.nickname}`,
          subtitle: `${r.content.slice(0, 60)}${r.content.length > 60 ? '…' : ''} · ${r.createdAt.toLocaleString('zh-CN')}`,
        }));
      }
      case 'logs': {
        const [auditLogs, appLogs] = await Promise.all([
          this.prisma.adminAuditLog.findMany({
            orderBy: { createdAt: 'desc' },
            take: 500,
            select: {
              id: true,
              action: true,
              username: true,
              module: true,
              createdAt: true,
            },
          }),
          this.prisma.appLog.findMany({
            where: { level: 'error' },
            orderBy: { createdAt: 'desc' },
            take: 500,
            select: { id: true, level: true, message: true, createdAt: true },
          }),
        ]);
        const auditItems: SyncCandidateItem[] = auditLogs.map((r) => ({
          id: `audit:${r.id}`,
          title: `[审计] ${r.action}`,
          subtitle: `${r.username ?? '-'} · ${r.module ?? '-'} · ${r.createdAt.toLocaleString('zh-CN')}`,
        }));
        const appItems: SyncCandidateItem[] = appLogs.map((r) => ({
          id: `app:${r.id}`,
          title: `[运行] ${r.level}`,
          subtitle: `${r.message.slice(0, 80)}${r.message.length > 80 ? '…' : ''} · ${r.createdAt.toLocaleString('zh-CN')}`,
        }));
        return [...auditItems, ...appItems];
      }
      default:
        return [];
    }
  }
}
