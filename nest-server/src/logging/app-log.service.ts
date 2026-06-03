import { Injectable, LoggerService } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { QueryAppLogsDto } from './dto/query-logs.dto';
import type { PaginatedResult } from './audit-log.service';

/** 应用错误日志最大保留条数（超出时清理最旧记录） */
const MAX_APP_LOGS = 5000;

/** 落库级别：运行日志仅持久化 error */
const PERSISTED_LEVEL = 'error';

/**
 * 应用运行日志服务：仅将 error 写入 SQLite AppLog 表；其余级别仅输出控制台。
 */
@Injectable()
export class AppLogService implements LoggerService {
  constructor(private readonly prisma: PrismaService) {}

  /** info — 不落库 */
  log(message: string, context?: string) {
    this.writeConsole('LOG', message, context);
  }

  /** error — 落库 + 控制台 */
  error(message: string, trace?: string, context?: string) {
    this.writeConsole('ERROR', message, context, trace);
    void this.persist(PERSISTED_LEVEL, message, context, trace);
  }

  /** warn — 不落库 */
  warn(message: string, context?: string) {
    this.writeConsole('WARN', message, context);
  }

  /** debug — 不落库 */
  debug(message: string, context?: string) {
    this.writeConsole('DEBUG', message, context);
  }

  /** verbose — 不落库 */
  verbose(message: string, context?: string) {
    this.writeConsole('VERBOSE', message, context);
  }

  /** 分页查询应用错误日志（按时间倒序，仅 error） */
  async findPage(query: QueryAppLogsDto): Promise<PaginatedResult<unknown>> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const where: Prisma.AppLogWhereInput = { level: PERSISTED_LEVEL };

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

  /** 非 error 级别输出到控制台，便于开发排查 */
  private writeConsole(
    level: string,
    message: string,
    context?: string,
    stack?: string,
  ) {
    const prefix = context ? `[${context}] ` : '';
    const line = `${prefix}${message}`;
    if (level === 'ERROR') {
      console.error(`[${level}] ${line}`, stack ?? '');
      return;
    }
    if (level === 'WARN') {
      console.warn(`[${level}] ${line}`);
      return;
    }
    console.log(`[${level}] ${line}`);
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
    const count = await this.prisma.appLog.count({ where: { level: PERSISTED_LEVEL } });
    if (count <= MAX_APP_LOGS) return;
    const excess = count - MAX_APP_LOGS;
    const oldest = await this.prisma.appLog.findMany({
      where: { level: PERSISTED_LEVEL },
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
