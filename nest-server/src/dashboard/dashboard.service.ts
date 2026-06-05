import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { APP_WEB_PAGE_VIEW_WHERE } from '../analytics/client-info.util';
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

/** 昨天 00:00:00 */
function startOfYesterday(date = new Date()): Date {
  const d = startOfDay(date);
  d.setDate(d.getDate() - 1);
  return d;
}

/** 格式化为 YYYY-MM-DD，用于按日聚合 */
function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** 图表横轴短标签 MM-DD */
function formatChartLabel(dateKey: string): string {
  return dateKey.slice(5);
}

/** 生成连续 N 天的日期键（含今天） */
function buildDayKeys(days: number): string[] {
  const keys: string[] = [];
  const anchor = startOfDay(new Date());
  anchor.setDate(anchor.getDate() - (days - 1));

  for (let i = 0; i < days; i++) {
    const d = new Date(anchor);
    d.setDate(anchor.getDate() + i);
    keys.push(formatDateKey(d));
  }
  return keys;
}

/** 将 createdAt 列表按日计数写入 buckets */
function countByDayKeys(
  keys: string[],
  rows: Array<{ createdAt: Date }>,
): Map<string, number> {
  const map = new Map<string, number>(keys.map((k) => [k, 0]));
  for (const row of rows) {
    const key = formatDateKey(row.createdAt);
    if (map.has(key)) {
      map.set(key, (map.get(key) ?? 0) + 1);
    }
  }
  return map;
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
  /** 页面访问 PV 统计 */
  visit: {
    today: number;
    week: number;
    total: number;
  };
  /** 互动数据：留言、AI 问答与访问摘要 */
  interaction: {
    messagesToday: number;
    messagesYesterday: number;
    messagesThisWeek: number;
    aiSessions: number;
    aiSessionsToday: number;
    aiSessionsThisWeek: number;
    aiMessages: number;
    /** 每会话平均消息数，无会话时为 null */
    aiAvgMessagesPerSession: number | null;
    pageViewsToday: number;
    pageViewsYesterday: number;
    pageViewsThisWeek: number;
    /** 最新一条留言摘要 */
    latestMessage: {
      nickname: string;
      content: string;
      createdAt: string;
    } | null;
    /** 本周访问最多的页面 */
    topPageThisWeek: {
      path: string;
      views: number;
    } | null;
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
  /** ECharts 图表数据 */
  charts: {
    dailyTrend: Array<{
      date: string;
      label: string;
      pageViews: number;
      messages: number;
      aiSessions: number;
    }>;
    topPages: Array<{ path: string; views: number }>;
    contentMix: {
      articles: number;
      projects: number;
      links: number;
    };
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
  /** 最近 app-web 页面访问（含 IP、浏览器、地区） */
  recentPageViews: Array<{
    id: number;
    path: string;
    ip: string | null;
    browser: string | null;
    os: string | null;
    device: string | null;
    locale: string | null;
    timezone: string | null;
    region: string | null;
    createdAt: string;
  }>;
}

/**
 * 管理后台首页概览服务。
 * 聚合内容计数、互动量、日志与运行时信息，避免前端多次请求。
 */
@Injectable()
export class DashboardService {
  /** 趋势图默认展示天数 */
  private readonly trendDays = 14;

  constructor(private readonly prisma: PrismaService) {}

  async getOverview(): Promise<DashboardOverviewDto> {
    const now = new Date();
    const dayStart = startOfDay(now);
    const yesterdayStart = startOfYesterday(now);
    const weekStart = startOfWeek(now);
    const monthStart = startOfMonth(now);
    const trendStart = startOfDay(now);
    trendStart.setDate(trendStart.getDate() - (this.trendDays - 1));

    const [
      siteConfig,
      articles,
      projects,
      links,
      messages,
      articlesThisMonth,
      messagesToday,
      messagesYesterday,
      messagesThisWeek,
      aiSessions,
      aiSessionsToday,
      aiSessionsThisWeek,
      aiMessages,
      pageViewsToday,
      pageViewsYesterday,
      pageViewsWeek,
      pageViewsTotal,
      trendPageViews,
      trendMessages,
      trendAiSessions,
      trendTopPageRows,
      auditToday,
      appErrorsToday,
      appErrorsThisWeek,
      recentMessages,
      recentArticles,
      recentAuditLogs,
      recentPageViews,
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
      this.prisma.message.count({
        where: { createdAt: { gte: yesterdayStart, lt: dayStart } },
      }),
      this.prisma.message.count({ where: { createdAt: { gte: weekStart } } }),
      this.prisma.aiChatSession.count(),
      this.prisma.aiChatSession.count({ where: { createdAt: { gte: dayStart } } }),
      this.prisma.aiChatSession.count({ where: { createdAt: { gte: weekStart } } }),
      this.prisma.aiChatMessage.count(),
      this.prisma.sitePageView.count({
        where: { ...APP_WEB_PAGE_VIEW_WHERE, createdAt: { gte: dayStart } },
      }),
      this.prisma.sitePageView.count({
        where: {
          ...APP_WEB_PAGE_VIEW_WHERE,
          createdAt: { gte: yesterdayStart, lt: dayStart },
        },
      }),
      this.prisma.sitePageView.count({
        where: { ...APP_WEB_PAGE_VIEW_WHERE, createdAt: { gte: weekStart } },
      }),
      this.prisma.sitePageView.count({ where: APP_WEB_PAGE_VIEW_WHERE }),
      this.prisma.sitePageView.findMany({
        where: { ...APP_WEB_PAGE_VIEW_WHERE, createdAt: { gte: trendStart } },
        select: { createdAt: true, path: true },
      }),
      this.prisma.message.findMany({
        where: { createdAt: { gte: trendStart } },
        select: { createdAt: true },
      }),
      this.prisma.aiChatSession.findMany({
        where: { createdAt: { gte: trendStart } },
        select: { createdAt: true },
      }),
      this.prisma.sitePageView.findMany({
        where: { ...APP_WEB_PAGE_VIEW_WHERE, createdAt: { gte: weekStart } },
        select: { path: true },
      }),
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
      this.prisma.sitePageView.findMany({
        where: APP_WEB_PAGE_VIEW_WHERE,
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          id: true,
          path: true,
          ip: true,
          browser: true,
          os: true,
          device: true,
          locale: true,
          timezone: true,
          region: true,
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

    const dayKeys = buildDayKeys(this.trendDays);
    const pageViewByDay = countByDayKeys(dayKeys, trendPageViews);
    const messageByDay = countByDayKeys(dayKeys, trendMessages);
    const aiSessionByDay = countByDayKeys(dayKeys, trendAiSessions);

    const dailyTrend = dayKeys.map((date) => ({
      date,
      label: formatChartLabel(date),
      pageViews: pageViewByDay.get(date) ?? 0,
      messages: messageByDay.get(date) ?? 0,
      aiSessions: aiSessionByDay.get(date) ?? 0,
    }));

    const pathCountMap = new Map<string, number>();
    for (const row of trendTopPageRows) {
      pathCountMap.set(row.path, (pathCountMap.get(row.path) ?? 0) + 1);
    }
    const topPages = [...pathCountMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([path, views]) => ({ path, views }));

    const latestMessageRow = recentMessages[0];
    const aiAvgMessagesPerSession =
      aiSessions > 0 ? Math.round((aiMessages / aiSessions) * 10) / 10 : null;

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
      visit: {
        today: pageViewsToday,
        week: pageViewsWeek,
        total: pageViewsTotal,
      },
      interaction: {
        messagesToday,
        messagesYesterday,
        messagesThisWeek,
        aiSessions,
        aiSessionsToday,
        aiSessionsThisWeek,
        aiMessages,
        aiAvgMessagesPerSession,
        pageViewsToday,
        pageViewsYesterday,
        pageViewsThisWeek: pageViewsWeek,
        latestMessage: latestMessageRow
          ? {
              nickname: latestMessageRow.nickname,
              content: latestMessageRow.content,
              createdAt: latestMessageRow.createdAt.toISOString(),
            }
          : null,
        topPageThisWeek: topPages[0] ?? null,
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
      charts: {
        dailyTrend,
        topPages,
        contentMix: { articles, projects, links },
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
      recentPageViews: recentPageViews.map((item) => ({
        ...item,
        createdAt: item.createdAt.toISOString(),
      })),
    };
  }
}
