import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { serializeCategory } from '../common/serializers';
import type { ConvCategory } from '@prisma/client';

@Injectable()
export class ConvCategoryService {
  constructor(private readonly prisma: PrismaService) {}

  /** 构建分类树 */
  private buildTree(categories: ConvCategory[]): ReturnType<typeof serializeCategory>[] {
    const map = new Map<number, ConvCategory & { children: ConvCategory[] }>();
    for (const cat of categories) {
      map.set(cat.id, { ...cat, children: [] });
    }
    const roots: (ConvCategory & { children: ConvCategory[] })[] = [];
    for (const cat of map.values()) {
      if (cat.parentId && map.has(cat.parentId)) {
        map.get(cat.parentId)!.children.push(cat);
      } else if (!cat.parentId) {
        roots.push(cat);
      }
    }
    return roots
      .filter((r) => r.enabled)
      .sort((a, b) => a.sort - b.sort)
      .map((r) => serializeCategory(r));
  }

  /** 分类树（含子分类） */
  async findTree() {
    const categories = await this.prisma.convCategory.findMany({
      where: { enabled: true },
      orderBy: { sort: 'asc' },
    });
    return this.buildTree(categories);
  }

  /** 一级分类列表 */
  async findRootList() {
    const list = await this.prisma.convCategory.findMany({
      where: { parentId: null, enabled: true },
      orderBy: { sort: 'asc' },
    });
    return list.map((item) => serializeCategory(item));
  }

  /** 获取分类及其所有子分类 ID（用于列表筛选） */
  async collectCategoryIds(categoryId: number): Promise<number[]> {
    const categories = await this.prisma.convCategory.findMany({
      where: { enabled: true },
    });
    const ids = new Set<number>([categoryId]);
    let changed = true;
    while (changed) {
      changed = false;
      for (const cat of categories) {
        if (cat.parentId && ids.has(cat.parentId) && !ids.has(cat.id)) {
          ids.add(cat.id);
          changed = true;
        }
      }
    }
    return [...ids];
  }
}
