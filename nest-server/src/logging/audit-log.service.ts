import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { QueryAuditLogsDto } from './dto/query-logs.dto';

/** 审计日志写入参数 */
export interface AuditLogInput {
  userId?: number;
  username?: string;
  action: string;
  module?: string;
  targetId?: string;
  detail?: string;
  ip?: string;
}

/** 分页列表响应 */
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * 管理后台操作审计日志服务。
 */
@Injectable()
export class AuditLogService {
  constructor(private readonly prisma: PrismaService) {}

  /** 记录一条审计日志 */
  async write(input: AuditLogInput) {
    try {
      await this.prisma.adminAuditLog.create({
        data: {
          userId: input.userId ?? null,
          username: input.username ?? null,
          action: input.action,
          module: input.module ?? null,
          targetId: input.targetId ?? null,
          detail: input.detail ?? null,
          ip: input.ip ?? null,
        },
      });
    } catch {
      /* 审计失败不阻塞业务 */
    }
  }

  /** 分页查询审计日志（按时间倒序） */
  async findPage(query: QueryAuditLogsDto): Promise<PaginatedResult<unknown>> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const where: Prisma.AdminAuditLogWhereInput = {};

    if (query.action?.trim()) {
      where.action = query.action.trim();
    }
    if (query.username?.trim()) {
      where.username = { contains: query.username.trim() };
    }
    if (query.module?.trim()) {
      where.module = { contains: query.module.trim() };
    }

    const [items, total] = await Promise.all([
      this.prisma.adminAuditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.adminAuditLog.count({ where }),
    ]);

    return { items, total, page, pageSize };
  }
}
