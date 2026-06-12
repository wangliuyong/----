import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { serializeBanner } from '../common/serializers';
import type { AdminBannerPayloadDto } from '../admin/dto/conv-admin.dto';

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

  /** 管理端：全部轮播图 */
  async findAdminList() {
    const list = await this.prisma.convBanner.findMany({
      orderBy: { sort: 'asc' },
    });
    return list.map(serializeBanner);
  }

  /** 管理端：创建轮播图 */
  async createAdmin(dto: AdminBannerPayloadDto) {
    const item = await this.prisma.convBanner.create({
      data: {
        imageUrl: dto.imageUrl,
        linkUrl: dto.linkUrl ?? '',
        sort: dto.sort ?? 0,
        online: dto.online ?? true,
      },
    });
    return serializeBanner(item);
  }

  /** 管理端：更新轮播图 */
  async updateAdmin(id: number, dto: AdminBannerPayloadDto) {
    await this.ensureExists(id);
    const item = await this.prisma.convBanner.update({
      where: { id },
      data: {
        imageUrl: dto.imageUrl,
        linkUrl: dto.linkUrl ?? '',
        sort: dto.sort,
        online: dto.online,
      },
    });
    return serializeBanner(item);
  }

  /** 管理端：删除轮播图 */
  async removeAdmin(id: number) {
    await this.ensureExists(id);
    await this.prisma.convBanner.delete({ where: { id } });
    return null;
  }

  private async ensureExists(id: number) {
    const item = await this.prisma.convBanner.findUnique({ where: { id } });
    if (!item) {
      throw new NotFoundException('轮播图不存在');
    }
    return item;
  }
}
