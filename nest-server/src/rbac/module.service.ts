import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateModuleDto, UpdateModuleDto } from './dto/module.dto';

@Injectable()
export class ModuleService {
  constructor(private readonly prisma: PrismaService) {}

  findTree() {
    return this.prisma.adminModule.findMany({
      orderBy: [{ sort: 'asc' }, { id: 'asc' }],
      include: { permissions: { orderBy: { sort: 'asc' } } },
    });
  }

  async create(dto: CreateModuleDto) {
    return this.prisma.adminModule.create({ data: dto });
  }

  async update(id: number, dto: UpdateModuleDto) {
    await this.ensureExists(id);
    return this.prisma.adminModule.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.ensureExists(id);
    const childCount = await this.prisma.adminModule.count({ where: { parentId: id } });
    if (childCount > 0) {
      throw new BadRequestException('请先删除子模块');
    }
    return this.prisma.adminModule.delete({ where: { id } });
  }

  private async ensureExists(id: number) {
    const row = await this.prisma.adminModule.findUnique({ where: { id } });
    if (!row) throw new NotFoundException('模块不存在');
    return row;
  }
}
