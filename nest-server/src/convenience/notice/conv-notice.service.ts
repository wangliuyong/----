import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { serializeNotice } from '../common/serializers';

@Injectable()
export class ConvNoticeService {
  constructor(private readonly prisma: PrismaService) {}

  /** 已发布公告列表 */
  async findPublishedList() {
    const list = await this.prisma.convNotice.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    });
    return list.map(serializeNotice);
  }

  /** 公告详情 */
  async findOne(id: number) {
    const item = await this.prisma.convNotice.findFirst({
      where: { id, published: true },
    });
    if (!item) {
      throw new NotFoundException('公告不存在');
    }
    return serializeNotice(item);
  }
}
