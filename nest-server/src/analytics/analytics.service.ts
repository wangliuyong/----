import { Injectable } from '@nestjs/common';
import type { Request } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import {
  isAppWebAnalyticsPath,
  parseUserAgent,
  resolveClientIp,
  resolveRegionFromIp,
} from './client-info.util';
import { RecordPageViewDto } from './dto/record-page-view.dto';

/**
 * 前台访问统计服务。
 * 仅记录 app-web 子应用页面（/about、/projects、/contact、/links），
 * 并持久化 IP、浏览器、地区等访客信息。
 */
@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  /** 记录一次 app-web 页面浏览 */
  async recordPageView(dto: RecordPageViewDto, req: Request) {
    const path = this.normalizePath(dto.path);
    if (!path || !isAppWebAnalyticsPath(path)) {
      return { recorded: false, reason: 'not_app_web_path' as const };
    }

    const ip = resolveClientIp(req);
    const userAgent = req.headers['user-agent'];
    const uaString = typeof userAgent === 'string' ? userAgent : undefined;
    const { browser, os, device } = parseUserAgent(uaString);
    const region = resolveRegionFromIp(ip);

    await this.prisma.sitePageView.create({
      data: {
        path,
        referrer: dto.referrer?.trim() || null,
        ip,
        userAgent: uaString?.slice(0, 512) ?? null,
        browser,
        os,
        device,
        locale: dto.locale?.trim() || null,
        timezone: dto.timezone?.trim() || null,
        region,
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
}
