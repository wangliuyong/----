import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateModuleDto, UpdateModuleDto } from './dto/module.dto';

@Injectable()
export class ModuleService {
  constructor(private readonly prisma: PrismaService) { }

  findTree() {
    return this.prisma.adminModule.findMany({
      orderBy: [{ sort: 'asc' }, { id: 'asc' }],
      include: { permissions: { orderBy: { sort: 'asc' } } },
    });
  }

  async create(dto: CreateModuleDto) {
    await this.assertMenuModule(dto);
    return this.prisma.adminModule.create({ data: { ...dto, type: 'menu' } });
  }

  async update(id: number, dto: UpdateModuleDto) {
    const existing = await this.ensureExists(id);
    await this.assertMenuModule({ ...existing, ...dto }, id);
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

  /** 模块仅支持 menu：无 path 为分组菜单，有 path 为页面菜单 */
  private async assertMenuModule(
    dto: {
      path?: string | null;
      parentId?: number | null;
      type?: string;
    },
    selfId?: number,
  ) {
    if (dto.type && dto.type !== 'menu') {
      throw new BadRequestException('模块类型仅支持菜单');
    }

    const hasPath = Boolean(dto.path);

    if (dto.parentId) {
      const parent = await this.prisma.adminModule.findUnique({ where: { id: dto.parentId } });
      if (!parent) throw new BadRequestException('上级菜单不存在');
      if (parent.path) {
        throw new BadRequestException('页面菜单下不能再挂子菜单，请选择分组菜单作为上级');
      }
      if (selfId) {
        await this.assertNotDescendant(selfId, dto.parentId);
      }
    }

    if (selfId && hasPath) {
      const childCount = await this.prisma.adminModule.count({ where: { parentId: selfId } });
      if (childCount > 0) {
        throw new BadRequestException('已有子菜单的分组不能设置为页面菜单');
      }
    }
  }

  /** 防止将菜单挂到自身或子孙节点下 */
  private async assertNotDescendant(selfId: number, parentId: number) {
    if (selfId === parentId) {
      throw new BadRequestException('不能将菜单设置到自身下');
    }
    let curId: number | null = parentId;
    while (curId) {
      if (curId === selfId) {
        throw new BadRequestException('不能将菜单设置到其子菜单下');
      }
      const row = await this.prisma.adminModule.findUnique({
        where: { id: curId },
        select: { parentId: true },
      });
      curId = row?.parentId ?? null;
    }
  }
}
