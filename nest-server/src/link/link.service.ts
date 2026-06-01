import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LinkService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.link.findMany({ orderBy: { sort: 'asc' } });
  }

  async findOne(id: number) {
    const item = await this.prisma.link.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('友链不存在');
    return item;
  }

  create(data: {
    name: string;
    url: string;
    description?: string;
    avatar?: string;
    sort?: number;
  }) {
    return this.prisma.link.create({ data });
  }

  update(
    id: number,
    data: Partial<{
      name: string;
      url: string;
      description: string;
      avatar: string;
      sort: number;
    }>,
  ) {
    return this.prisma.link.update({ where: { id }, data });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.link.delete({ where: { id } });
  }
}
