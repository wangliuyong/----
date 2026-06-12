import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { pageResult, serializeCollect } from '../common/serializers';

@Injectable()
export class ConvCollectService {
  constructor(private readonly prisma: PrismaService) {}

  /** 我的收藏列表 */
  async findList(userId: number, page = 1, pageSize = 10) {
    const where = { userId };
    const [total, rows] = await Promise.all([
      this.prisma.convCollect.count({ where }),
      this.prisma.convCollect.findMany({
        where,
        include: { info: { include: { category: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);
    const list = rows.map((item) => serializeCollect(item));
    return pageResult(list, total, page, pageSize);
  }

  /** 收藏信息 */
  async collect(userId: number, infoId: number) {
    const info = await this.prisma.convCityInfo.findUnique({ where: { id: infoId } });
    if (!info || info.auditStatus !== 'APPROVED') {
      throw new NotFoundException('信息不存在');
    }

    const exists = await this.prisma.convCollect.findUnique({
      where: { userId_infoId: { userId, infoId } },
    });
    if (exists) {
      throw new ConflictException('已收藏');
    }

    await this.prisma.$transaction([
      this.prisma.convCollect.create({ data: { userId, infoId } }),
      this.prisma.convCityInfo.update({
        where: { id: infoId },
        data: { collectCount: { increment: 1 } },
      }),
    ]);
    return null;
  }

  /** 取消收藏 */
  async uncollect(userId: number, infoId: number) {
    const row = await this.prisma.convCollect.findUnique({
      where: { userId_infoId: { userId, infoId } },
    });
    if (!row) {
      return null;
    }

    await this.prisma.$transaction([
      this.prisma.convCollect.delete({ where: { id: row.id } }),
      this.prisma.convCityInfo.update({
        where: { id: infoId },
        data: { collectCount: { decrement: 1 } },
      }),
    ]);
    return null;
  }

  /** 已收藏 infoId 列表 */
  async findCollectedIds(userId: number) {
    const rows = await this.prisma.convCollect.findMany({
      where: { userId },
      select: { infoId: true },
    });
    return rows.map((r) => r.infoId);
  }
}
