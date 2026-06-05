import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { PrismaService } from '../prisma/prisma.service';

/** 当天 00:00:00（服务端本地时区） */
function startOfDay(date = new Date()): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** 本周一 00:00:00 */
function startOfWeek(date = new Date()): Date {
  const d = startOfDay(date);
  const weekday = d.getDay();
  const diff = weekday === 0 ? 6 : weekday - 1;
  d.setDate(d.getDate() - diff);
  return d;
}

/** 本月 1 日 00:00:00 */
function startOfMonth(date = new Date()): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

/** 解析 SQLite 文件路径（兼容 prisma/dev.db 与 cwd/dev.db） */
function resolveSqlitePath(rawPath: string): string {
  if (path.isAbsolute(rawPath)) return rawPath;

  const fromCwd = path.join(process.cwd(), rawPath);
  if (fs.existsSync(fromCwd)) return fromCwd;

  const fromPrisma = path.join(process.cwd(), 'prisma', rawPath.replace(/^\.\//, ''));
  if (fs.existsSync(fromPrisma)) return fromPrisma;

  return fromCwd;
}

/** 读取 SQLite 数据库文件大小（字节），失败返回 null */
function readDatabaseSizeBytes(): number | null {
  const url = process.env.DATABASE_URL;
  if (!url?.startsWith('file:')) return null;

  const rawPath = url.replace(/^file:/, '');
  const resolved = resolveSqlitePath(rawPath);

  try {
    return fs.statSync(resolved).size;
  } catch {
    return null;
  }
}

/** 首页概览 DTO（与前端 types 对齐） */
export interface DashboardOverviewDto {
  site: {
    siteName: string;
  };
  content: {
    articles: number;
    projects: number;
    links: number;
    messages: number;
    articlesThisMonth: number;
  };
  /** 互动数据：留言与 AI 问答（暂无独立 PV/UV 埋点，以真实互动量代替） */
  interaction: {
    messagesToday: number;
    messagesThisWeek: number;
    aiSessions: number;
    aiSessionsToday: number;
    aiSessionsThisWeek: number;
    aiMessages: number;
  };
  logs: {
    auditToday: number;
    appErrorsToday: number;
    appErrorsThisWeek: number;
  };
  server: {
    nodeVersion: string;
    platform: string;
    arch: string;
    hostname: string;
    uptimeSeconds: number;
    env: string;
    memory: {
      totalMb: number;
      freeMb: number;
      usedMb: number;
      rssMb: number;
    };
    databaseSizeBytes: number | null;
  };
  ai: {
    configured: boolean;
    lastSyncStatus: string | null;
    lastSyncAt: string | null;
    vectorChunkCount: number;
  };
  recent: {
    messages: Array<{
      id: number;
      nickname: string;
      content: string;
      createdAt: string;
    }>;
    articles: Array<{
      id: number;
      title: string;
      publishedAt: string;
    }>;
    auditLogs: Array<{
      id: number;
      username: string | null;
      action: string;
      module: string | null;
      createdAt: string;
    }>;
  };
}

/**
 * 管理后台首页概览服务。
 * 聚合内容计数、互动量、日志与运行时信息，避免前端多次请求。
 */
@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview(): Promise<DashboardOverviewDto> {
    const now = new Date();
    const dayStart = startOfDay(now);
    const weekStart = startOfWeek(now);
    const monthStart = startOfMonth(now);

    const [
      siteConfig,
      articles,
      projects,
      links,
      messages,
      articlesThisMonth,
      messagesToday,
      messagesThisWeek,
      aiSessions,
      aiSessionsToday,
      aiSessionsThisWeek,
      aiMessages,
      auditToday,
      appErrorsToday,
      appErrorsThisWeek,
      recentMessages,
      recentArticles,
      recentAuditLogs,
      aiConfig,
      lastSync,
      syncChunkSum,
    ] = await Promise.all([
      this.prisma.siteConfig.findUnique({ where: { id: 1 } }),
      this.prisma.article.count(),
      this.prisma.project.count(),
      this.prisma.link.count(),
      this.prisma.message.count(),
      this.prisma.article.count({ where: { publishedAt: { gte: monthStart } } }),
      this.prisma.message.count({ where: { createdAt: { gte: dayStart } } }),
      this.prisma.message.count({ where: { createdAt: { gte: weekStart } } }),
      this.prisma.aiChatSession.count(),
      this.prisma.aiChatSession.count({ where: { createdAt: { gte: dayStart } } }),
      this.prisma.aiChatSession.count({ where: { createdAt: { gte: weekStart } } }),
      this.prisma.aiChatMessage.count(),
      this.prisma.adminAuditLog.count({ where: { createdAt: { gte: dayStart } } }),
      this.prisma.appLog.count({
        where: { level: 'error', createdAt: { gte: dayStart } },
      }),
      this.prisma.appLog.count({
        where: { level: 'error', createdAt: { gte: weekStart } },
      }),
      this.prisma.message.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, nickname: true, content: true, createdAt: true },
      }),
      this.prisma.article.findMany({
        orderBy: { publishedAt: 'desc' },
        take: 5,
        select: { id: true, title: true, publishedAt: true },
      }),
      this.prisma.adminAuditLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          username: true,
          action: true,
          module: true,
          createdAt: true,
        },
      }),
      this.prisma.aiConfig.findUnique({ where: { id: 1 } }),
      this.prisma.aiSyncRecord.findFirst({
        orderBy: { startedAt: 'desc' },
        select: { status: true, startedAt: true, chunkCount: true },
      }),
      this.prisma.aiSyncRecord.aggregate({
        _sum: { chunkCount: true },
      }),
    ]);

    const mem = process.memoryUsage();
    const totalMem = os.totalmem();
    const freeMem = os.freemem();

    return {
      site: {
        siteName: siteConfig?.siteName ?? '个人网站',
      },
      content: {
        articles,
        projects,
        links,
        messages,
        articlesThisMonth,
      },
      interaction: {
        messagesToday,
        messagesThisWeek,
        aiSessions,
        aiSessionsToday,
        aiSessionsThisWeek,
        aiMessages,
      },
      logs: {
        auditToday,
        appErrorsToday,
        appErrorsThisWeek,
      },
      server: {
        nodeVersion: process.version,
        platform: `${os.type()} ${os.release()}`,
        arch: os.arch(),
        hostname: os.hostname(),
        uptimeSeconds: Math.floor(process.uptime()),
        env: process.env.NODE_ENV ?? 'development',
        memory: {
          totalMb: Math.round(totalMem / 1024 / 1024),
          freeMb: Math.round(freeMem / 1024 / 1024),
          usedMb: Math.round((totalMem - freeMem) / 1024 / 1024),
          rssMb: Math.round(mem.rss / 1024 / 1024),
        },
        databaseSizeBytes: readDatabaseSizeBytes(),
      },
      ai: {
        configured: Boolean(aiConfig?.openaiApiKey?.trim()),
        lastSyncStatus: lastSync?.status ?? null,
        lastSyncAt: lastSync?.startedAt.toISOString() ?? null,
        vectorChunkCount: syncChunkSum._sum.chunkCount ?? 0,
      },
      recent: {
        messages: recentMessages.map((item) => ({
          ...item,
          createdAt: item.createdAt.toISOString(),
        })),
        articles: recentArticles.map((item) => ({
          ...item,
          publishedAt: item.publishedAt.toISOString(),
        })),
        auditLogs: recentAuditLogs.map((item) => ({
          ...item,
          createdAt: item.createdAt.toISOString(),
        })),
      },
    };
  }
}
