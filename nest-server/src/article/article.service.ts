import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ArticleService {
  constructor(private readonly prisma: PrismaService) {}

  /** 文章列表，支持分类、标签、年月归档筛选 */
  findAll(query: {
    category?: string;
    tag?: string;
    year?: string;
    month?: string;
  }) {
    const where: Record<string, unknown> = {};

    if (query.category) {
      where.category = query.category;
    }
    if (query.tag) {
      where.tags = { contains: query.tag };
    }
    if (query.year) {
      const year = parseInt(query.year, 10);
      const month = query.month ? parseInt(query.month, 10) - 1 : 0;
      const start = new Date(year, month, 1);
      const end = query.month
        ? new Date(year, month + 1, 0, 23, 59, 59)
        : new Date(year + 1, 0, 0, 23, 59, 59);
      where.publishedAt = { gte: start, lte: end };
    }

    return this.prisma.article.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const article = await this.prisma.article.findUnique({ where: { id } });
    if (!article) {
      throw new NotFoundException('文章不存在');
    }
    return article;
  }

  async findBySlug(slug: string) {
    const article = await this.prisma.article.findUnique({ where: { slug } });
    if (!article) {
      throw new NotFoundException('文章不存在');
    }
    return article;
  }
}
