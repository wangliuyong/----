import { Injectable, LoggerService } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { QueryAppLogsDto } from './dto/query-logs.dto';
import type { PaginatedResult } from './audit-log.service';

/** 应用日志最大保留条数（超出时清理最旧记录） */
const MAX_APP_LOGS = 5000;

/**
 * 应用运行日志服务：写入 SQLite AppLog 表，供 AI 向量化与后台排查。
 */
@Injectable()
export class AppLogService implements LoggerService {
  constructor(private readonly prisma: PrismaService) {}

  /** Nest LoggerService 接口：写入日志 */
  log(message: string, context?: string) {
    void this.persist('info', message, context);
  }

  error(message: string, trace?: string, context?: string) {
    void this.persist('error', message, context, trace);
  }

  warn(message: string, context?: string) {
    void this.persist('warn', message, context);
  }

  debug(message: string, context?: string) {
    void this.persist('debug', message, context);
  }

  verbose(message: string, context?: string) {
    void this.persist('verbose', message, context);
  }

  /** 分页查询应用运行日志（按时间倒序） */
  async findPage(query: QueryAppLogsDto): Promise<PaginatedResult<unknown>> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const where: Prisma.AppLogWhereInput = {};

    if (query.level?.trim()) {
      where.level = query.level.trim();
    }
    if (query.keyword?.trim()) {
      where.message = { contains: query.keyword.trim() };
    }

    const [items, total] = await Promise.all([
      this.prisma.appLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.appLog.count({ where }),
    ]);

    return { items, total, page, pageSize };
  }

  /** 异步落库，失败时不阻塞主流程 */
  private async persist(
    level: string,
    message: string,
    context?: string,
    stack?: string,
  ) {
    try {
      await this.prisma.appLog.create({
        data: { level, message, context: context ?? null, stack: stack ?? null },
      });
      await this.trimOldLogs();
    } catch {
      /* 日志落库失败时静默，避免递归 */
    }
  }

  /** 保留最近 MAX_APP_LOGS 条，删除更早记录 */
  private async trimOldLogs() {
    const count = await this.prisma.appLog.count();
    if (count <= MAX_APP_LOGS) return;
    const excess = count - MAX_APP_LOGS;
    const oldest = await this.prisma.appLog.findMany({
      orderBy: { createdAt: 'asc' },
      take: excess,
      select: { id: true },
    });
    if (oldest.length) {
      await this.prisma.appLog.deleteMany({
        where: { id: { in: oldest.map((r) => r.id) } },
      });
    }
  }
}
