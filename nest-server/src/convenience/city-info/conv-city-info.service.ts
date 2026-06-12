import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { ConvCategoryService } from '../category/conv-category.service';
import { pageResult, serializeCityInfo } from '../common/serializers';
import type { AdminCityInfoQueryDto } from '../admin/dto/conv-admin.dto';
import type { CityInfoPayloadDto, CityInfoQueryDto } from './dto/city-info.dto';

@Injectable()
export class ConvCityInfoService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly categoryService: ConvCategoryService,
  ) {}

  /** 分页查询已审核通过的便民信息 */
  async findApprovedList(query: CityInfoQueryDto, userId?: number) {
    const page = query.page || 1;
    const pageSize = query.pageSize || 10;
    const where: Prisma.ConvCityInfoWhereInput = {
      auditStatus: 'APPROVED',
    };

    if (query.categoryId) {
      const categoryIds = await this.categoryService.collectCategoryIds(query.categoryId);
      where.categoryId = { in: categoryIds };
    }

    if (query.keyword?.trim()) {
      const kw = query.keyword.trim();
      where.OR = [{ title: { contains: kw } }, { content: { contains: kw } }];
    }

    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      where.price = {};
      if (query.minPrice !== undefined) {
        where.price.gte = query.minPrice;
      }
      if (query.maxPrice !== undefined) {
        where.price.lte = query.maxPrice;
      }
    }

    let orderBy: Prisma.ConvCityInfoOrderByWithRelationInput = { createdAt: 'desc' };
    if (query.sortBy === 'price') {
      orderBy = { price: 'asc' };
    }

    const [total, rows] = await Promise.all([
      this.prisma.convCityInfo.count({ where }),
      this.prisma.convCityInfo.findMany({
        where,
        include: { category: true },
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    const collectedIds = userId ? await this.queryCollectedIds(userId) : [];
    const list = rows.map((item) =>
      serializeCityInfo(item, { collected: collectedIds.includes(item.id) }),
    );

    return pageResult(list, total, page, pageSize);
  }

  /** 查询详情并增加浏览量 */
  async findOne(id: number, userId?: number) {
    const item = await this.prisma.convCityInfo.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!item || item.auditStatus !== 'APPROVED') {
      throw new NotFoundException('信息不存在');
    }

    await this.prisma.convCityInfo.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    const collectedIds = userId ? await this.queryCollectedIds(userId) : [];
    return serializeCityInfo(
      { ...item, viewCount: item.viewCount + 1 },
      { collected: collectedIds.includes(item.id) },
    );
  }

  /** 查询当前用户发布的信息（含待审核） */
  async findMineList(userId: number, page = 1, pageSize = 10) {
    const where = { userId };
    const [total, rows] = await Promise.all([
      this.prisma.convCityInfo.count({ where }),
      this.prisma.convCityInfo.findMany({
        where,
        include: { category: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);
    const list = rows.map((item) => serializeCityInfo(item));
    return pageResult(list, total, page, pageSize);
  }

  /** 发布便民信息 */
  async create(userId: number, dto: CityInfoPayloadDto) {
    const category = await this.prisma.convCategory.findFirst({
      where: { id: dto.categoryId, enabled: true },
    });
    if (!category) {
      throw new NotFoundException('分类不存在');
    }

    const item = await this.prisma.convCityInfo.create({
      data: {
        userId,
        categoryId: dto.categoryId,
        title: dto.title,
        content: dto.content,
        price: dto.price,
        address: dto.address,
        latitude: dto.latitude,
        longitude: dto.longitude,
        images: JSON.stringify(dto.images || []),
        auditStatus: 'PENDING',
      },
      include: { category: true },
    });
    return serializeCityInfo(item);
  }

  /** 删除自己的便民信息 */
  async remove(userId: number, id: number) {
    const item = await this.prisma.convCityInfo.findUnique({ where: { id } });
    if (!item) {
      throw new NotFoundException('信息不存在');
    }
    if (item.userId !== userId) {
      throw new ForbiddenException('无权删除该信息');
    }
    await this.prisma.convCityInfo.delete({ where: { id } });
    return null;
  }

  /** 管理端：分页查询（含全部审核状态） */
  async findAdminList(query: AdminCityInfoQueryDto) {
    const page = query.page || 1;
    const pageSize = query.pageSize || 10;
    const where: Prisma.ConvCityInfoWhereInput = {};

    if (query.auditStatus) {
      where.auditStatus = query.auditStatus;
    }
    if (query.categoryId) {
      const categoryIds = await this.categoryService.collectCategoryIds(query.categoryId);
      where.categoryId = { in: categoryIds };
    }
    if (query.keyword?.trim()) {
      const kw = query.keyword.trim();
      where.OR = [{ title: { contains: kw } }, { content: { contains: kw } }];
    }

    const [total, rows] = await Promise.all([
      this.prisma.convCityInfo.count({ where }),
      this.prisma.convCityInfo.findMany({
        where,
        include: {
          category: true,
          user: { select: { id: true, nickname: true, phone: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    const list = rows.map((item) => ({
      ...serializeCityInfo(item),
      userNickname: item.user.nickname,
      userPhone: item.user.phone ?? undefined,
    }));
    return pageResult(list, total, page, pageSize);
  }

  /** 管理端：详情（不限审核状态） */
  async findAdminOne(id: number) {
    const item = await this.prisma.convCityInfo.findUnique({
      where: { id },
      include: {
        category: true,
        user: { select: { id: true, nickname: true, phone: true } },
      },
    });
    if (!item) {
      throw new NotFoundException('信息不存在');
    }
    return {
      ...serializeCityInfo(item),
      userNickname: item.user.nickname,
      userPhone: item.user.phone ?? undefined,
    };
  }

  /** 管理端：审核通过/驳回 */
  async audit(id: number, auditStatus: 'APPROVED' | 'REJECTED') {
    const item = await this.prisma.convCityInfo.findUnique({ where: { id } });
    if (!item) {
      throw new NotFoundException('信息不存在');
    }
    const updated = await this.prisma.convCityInfo.update({
      where: { id },
      data: { auditStatus },
      include: { category: true },
    });
    return serializeCityInfo(updated);
  }

  /** 管理端：强制删除 */
  async adminRemove(id: number) {
    const item = await this.prisma.convCityInfo.findUnique({ where: { id } });
    if (!item) {
      throw new NotFoundException('信息不存在');
    }
    await this.prisma.convCityInfo.delete({ where: { id } });
    return null;
  }

  private async queryCollectedIds(userId: number): Promise<number[]> {
    const rows = await this.prisma.convCollect.findMany({
      where: { userId },
      select: { infoId: true },
    });
    return rows.map((r) => r.infoId);
  }
}
