import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { pageResult, serializeNotice } from '../common/serializers';
import type { AdminNoticePayloadDto } from '../admin/dto/conv-admin.dto';

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

  /** 管理端：全部公告 */
  async findAdminList() {
    const list = await this.prisma.convNotice.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return list.map(serializeNotice);
  }

  /** 管理端：创建公告 */
  async createAdmin(dto: AdminNoticePayloadDto) {
    const item = await this.prisma.convNotice.create({
      data: {
        title: dto.title,
        content: dto.content,
        published: dto.published ?? true,
      },
    });
    return serializeNotice(item);
  }

  /** 管理端：更新公告 */
  async updateAdmin(id: number, dto: AdminNoticePayloadDto) {
    await this.ensureExists(id);
    const item = await this.prisma.convNotice.update({
      where: { id },
      data: {
        title: dto.title,
        content: dto.content,
        published: dto.published,
      },
    });
    return serializeNotice(item);
  }

  /** 管理端：删除公告 */
  async removeAdmin(id: number) {
    await this.ensureExists(id);
    await this.prisma.convNotice.delete({ where: { id } });
    return null;
  }

  private async ensureExists(id: number) {
    const item = await this.prisma.convNotice.findUnique({ where: { id } });
    if (!item) {
      throw new NotFoundException('公告不存在');
    }
    return item;
  }
}
