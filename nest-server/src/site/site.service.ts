import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  ContactConfigDto,
  DEFAULT_ABOUT,
  DEFAULT_CONTACT,
  DEFAULT_NAV,
  NavItemDto,
  ProfileDto,
  PublicSiteConfig,
} from './site.types';

/** 站点配置读写：单行 SiteConfig 表，id 固定为 1 */
@Injectable()
export class SiteService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  /** 模块启动时确保存在默认配置行 */
  async onModuleInit() {
    await this.ensureConfig();
  }

  private parseJson<T>(raw: string, fallback: T): T {
    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  }

  private async ensureConfig() {
    const existing = await this.prisma.siteConfig.findUnique({ where: { id: 1 } });
    if (existing) return;

    await this.prisma.siteConfig.create({
      data: {
        id: 1,
        siteName: '王刘永的博客',
        githubUrl: 'https://github.com/wly-dev',
        email: 'hello@wly.dev',
        navJson: JSON.stringify(DEFAULT_NAV),
        aboutJson: JSON.stringify(DEFAULT_ABOUT),
        contactJson: JSON.stringify(DEFAULT_CONTACT),
      },
    });
  }

  private rowToPublic(row: {
    siteName: string;
    githubUrl: string;
    email: string;
    navJson: string;
    aboutJson: string;
    contactJson: string;
  }): PublicSiteConfig {
    return {
      siteName: row.siteName,
      githubUrl: row.githubUrl,
      email: row.email,
      nav: this.parseJson<NavItemDto[]>(row.navJson, DEFAULT_NAV),
      about: this.parseJson<ProfileDto>(row.aboutJson, DEFAULT_ABOUT),
      contact: this.parseJson<ContactConfigDto>(row.contactJson, DEFAULT_CONTACT),
    };
  }

  /** 公开读取站点配置 */
  async getPublicConfig(): Promise<PublicSiteConfig> {
    await this.ensureConfig();
    const row = await this.prisma.siteConfig.findUnique({ where: { id: 1 } });
    if (!row) throw new NotFoundException('站点配置不存在');
    return this.rowToPublic(row);
  }

  /** 管理端更新站点配置 */
  async updateConfig(dto: Partial<PublicSiteConfig>) {
    await this.ensureConfig();
    const current = await this.getPublicConfig();
    const merged: PublicSiteConfig = {
      siteName: dto.siteName ?? current.siteName,
      githubUrl: dto.githubUrl ?? current.githubUrl,
      email: dto.email ?? current.email,
      nav: dto.nav ?? current.nav,
      about: dto.about ?? current.about,
      contact: dto.contact ?? current.contact,
    };

    await this.prisma.siteConfig.update({
      where: { id: 1 },
      data: {
        siteName: merged.siteName,
        githubUrl: merged.githubUrl,
        email: merged.email,
        navJson: JSON.stringify(merged.nav),
        aboutJson: JSON.stringify(merged.about),
        contactJson: JSON.stringify(merged.contact),
      },
    });

    return merged;
  }
}
