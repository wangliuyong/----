import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePermissionDto, UpdatePermissionDto } from './dto/permission.dto';

@Injectable()
export class PermissionService {
  constructor(private readonly prisma: PrismaService) {}

  listByModule(moduleId: number) {
    return this.prisma.adminPermission.findMany({
      where: { moduleId },
      orderBy: { sort: 'asc' },
    });
  }

  async create(moduleId: number, dto: CreatePermissionDto) {
    await this.ensureModule(moduleId);
    return this.prisma.adminPermission.create({
      data: { ...dto, moduleId },
    });
  }

  async update(id: number, dto: UpdatePermissionDto) {
    await this.ensurePermission(id);
    return this.prisma.adminPermission.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.ensurePermission(id);
    return this.prisma.adminPermission.delete({ where: { id } });
  }

  private async ensureModule(moduleId: number) {
    const row = await this.prisma.adminModule.findUnique({ where: { id: moduleId } });
    if (!row) throw new NotFoundException('模块不存在');
  }

  private async ensurePermission(id: number) {
    const row = await this.prisma.adminPermission.findUnique({ where: { id } });
    if (!row) throw new NotFoundException('权限点不存在');
  }
}
