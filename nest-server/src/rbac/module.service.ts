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
    this.assertMenuModule(dto);
    return this.prisma.adminModule.create({ data: { ...dto, type: 'menu' } });
  }

  async update(id: number, dto: UpdateModuleDto) {
    const existing = await this.ensureExists(id);
    this.assertMenuModule({ ...existing, ...dto });
    return this.prisma.adminModule.update({ where: { id }, data: { ...dto, type: 'menu' } });
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

  /** 模块仅支持 menu：分组菜单无 path，页面菜单需 path + component */
  private assertMenuModule(dto: {
    path?: string | null;
    component?: string | null;
    type?: string;
  }) {
    if (dto.type && dto.type !== 'menu') {
      throw new BadRequestException('模块类型仅支持菜单');
    }
    const hasPath = Boolean(dto.path);
    const hasComponent = Boolean(dto.component);
    if (hasPath !== hasComponent) {
      throw new BadRequestException('页面菜单需同时配置路由与组件，分组菜单两者均留空');
    }
  }
}
