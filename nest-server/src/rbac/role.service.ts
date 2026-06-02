import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AssignRolePermissionsDto, CreateRoleDto, UpdateRoleDto } from './dto/role.dto';

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.adminRole.findMany({
      orderBy: { id: 'asc' },
      include: {
        permissions: { include: { permission: true } },
        _count: { select: { users: true } },
      },
    });
  }

  findOne(id: number) {
    return this.prisma.adminRole.findUnique({
      where: { id },
      include: {
        permissions: { include: { permission: true } },
      },
    });
  }

  create(dto: CreateRoleDto) {
    return this.prisma.adminRole.create({ data: dto });
  }

  async update(id: number, dto: UpdateRoleDto) {
    await this.ensureExists(id);
    return this.prisma.adminRole.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.ensureExists(id);
    return this.prisma.adminRole.delete({ where: { id } });
  }

  async assignPermissions(id: number, dto: AssignRolePermissionsDto) {
    await this.ensureExists(id);
    await this.prisma.adminRolePermission.deleteMany({ where: { roleId: id } });
    if (dto.permissionIds.length) {
      await this.prisma.adminRolePermission.createMany({
        data: dto.permissionIds.map((permissionId) => ({ roleId: id, permissionId })),
      });
    }
    return this.findOne(id);
  }

  private async ensureExists(id: number) {
    const row = await this.prisma.adminRole.findUnique({ where: { id } });
    if (!row) throw new NotFoundException('角色不存在');
  }
}
