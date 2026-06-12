import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { serializeCategory } from '../common/serializers';
import type { ConvCategory } from '@prisma/client';
import type {
  AdminCategoryCreateDto,
  AdminCategoryUpdateDto,
} from '../admin/dto/conv-admin.dto';

@Injectable()
export class ConvCategoryService {
  constructor(private readonly prisma: PrismaService) {}

  /** 构建分类树 */
  private buildTree(
    categories: ConvCategory[],
    options?: { includeDisabled?: boolean },
  ): ReturnType<typeof serializeCategory>[] {
    const includeDisabled = options?.includeDisabled ?? false;
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
    const serializeNode = (
      node: ConvCategory & { children: ConvCategory[] },
    ): ReturnType<typeof serializeCategory> => ({
      id: node.id,
      parentId: node.parentId,
      name: node.name,
      sort: node.sort,
      enabled: node.enabled,
      children: node.children
        .filter((c) => includeDisabled || c.enabled)
        .sort((a, b) => a.sort - b.sort)
        .map((c) => {
          const child = map.get(c.id);
          return serializeNode(child ? { ...child, children: child.children } : { ...c, children: [] });
        }),
    });

    return roots
      .filter((r) => includeDisabled || r.enabled)
      .sort((a, b) => a.sort - b.sort)
      .map((r) => serializeNode(r));
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

  /** 管理端：完整分类树（含禁用项） */
  async findAdminTree() {
    const categories = await this.prisma.convCategory.findMany({
      orderBy: { sort: 'asc' },
    });
    return this.buildTree(categories, { includeDisabled: true });
  }

  /** 管理端：扁平列表 */
  async findAdminFlatList() {
    const list = await this.prisma.convCategory.findMany({
      orderBy: [{ parentId: 'asc' }, { sort: 'asc' }],
    });
    return list.map((item) => serializeCategory(item));
  }

  /** 管理端：新建分类 */
  async createAdmin(dto: AdminCategoryCreateDto) {
    const exists = await this.prisma.convCategory.findUnique({
      where: { id: dto.id },
    });
    if (exists) {
      throw new BadRequestException('分类 ID 已存在');
    }
    if (dto.parentId) {
      const parent = await this.prisma.convCategory.findUnique({
        where: { id: dto.parentId },
      });
      if (!parent) {
        throw new NotFoundException('父分类不存在');
      }
    }
    const item = await this.prisma.convCategory.create({
      data: {
        id: dto.id,
        parentId: dto.parentId ?? null,
        name: dto.name,
        sort: dto.sort ?? 0,
        enabled: dto.enabled ?? true,
      },
    });
    return serializeCategory(item);
  }

  /** 管理端：更新分类 */
  async updateAdmin(id: number, dto: AdminCategoryUpdateDto) {
    const item = await this.prisma.convCategory.findUnique({ where: { id } });
    if (!item) {
      throw new NotFoundException('分类不存在');
    }
    if (dto.parentId !== undefined && dto.parentId !== null) {
      if (dto.parentId === id) {
        throw new BadRequestException('不能将分类设为自己的子分类');
      }
      const parent = await this.prisma.convCategory.findUnique({
        where: { id: dto.parentId },
      });
      if (!parent) {
        throw new NotFoundException('父分类不存在');
      }
    }
    const updated = await this.prisma.convCategory.update({
      where: { id },
      data: {
        parentId: dto.parentId === undefined ? undefined : dto.parentId,
        name: dto.name,
        sort: dto.sort,
        enabled: dto.enabled,
      },
    });
    return serializeCategory(updated);
  }

  /** 管理端：删除分类 */
  async removeAdmin(id: number) {
    const item = await this.prisma.convCategory.findUnique({ where: { id } });
    if (!item) {
      throw new NotFoundException('分类不存在');
    }
    const childCount = await this.prisma.convCategory.count({
      where: { parentId: id },
    });
    if (childCount > 0) {
      throw new BadRequestException('请先删除子分类');
    }
    const infoCount = await this.prisma.convCityInfo.count({
      where: { categoryId: id },
    });
    if (infoCount > 0) {
      throw new BadRequestException('该分类下仍有便民信息，无法删除');
    }
    await this.prisma.convCategory.delete({ where: { id } });
    return null;
  }
}
