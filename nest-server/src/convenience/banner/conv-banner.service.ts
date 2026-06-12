import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { serializeBanner } from '../common/serializers';

@Injectable()
export class ConvBannerService {
  constructor(private readonly prisma: PrismaService) {}

  /** 查询在线轮播图列表 */
  async findOnlineList() {
    const list = await this.prisma.convBanner.findMany({
      where: { online: true },
      orderBy: { sort: 'asc' },
    });
    return list.map(serializeBanner);
  }
}
