import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.project.findMany({ orderBy: { id: 'asc' } });
  }

  async findOne(id: number) {
    const item = await this.prisma.project.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('项目不存在');
    return item;
  }

  create(data: {
    name: string;
    desc: string;
    techStack?: string;
    githubUrl?: string;
    previewUrl?: string;
  }) {
    return this.prisma.project.create({ data });
  }

  update(
    id: number,
    data: Partial<{
      name: string;
      desc: string;
      techStack: string;
      githubUrl: string;
      previewUrl: string;
    }>,
  ) {
    return this.prisma.project.update({ where: { id }, data });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.project.delete({ where: { id } });
  }
}
