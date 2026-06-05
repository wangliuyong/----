import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RecordPageViewDto } from './dto/record-page-view.dto';

/**
 * 前台访问统计服务。
 * 仅记录公开站点路径，排除管理后台与静态资源误报。
 */
@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  /** 记录一次页面浏览 */
  async recordPageView(dto: RecordPageViewDto) {
    const path = this.normalizePath(dto.path);
    if (!path || this.shouldIgnorePath(path)) {
      return { recorded: false };
    }

    await this.prisma.sitePageView.create({
      data: {
        path,
        referrer: dto.referrer?.trim() || null,
      },
    });

    return { recorded: true };
  }

  /** 统一路径格式，便于聚合统计 */
  private normalizePath(raw: string): string {
    const trimmed = raw.trim();
    if (!trimmed) return '/';
    const withSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
    return withSlash.replace(/\/+$/, '') || '/';
  }

  /** 跳过后台、API 与非页面路径 */
  private shouldIgnorePath(path: string): boolean {
    if (path.startsWith('/admin')) return true;
    if (path.startsWith('/api')) return true;
    if (path.includes('.')) return true;
    return false;
  }
}
