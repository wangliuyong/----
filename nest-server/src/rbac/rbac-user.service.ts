import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import {
  AssignUserRolesDto,
  CreateAdminUserDto,
  ResetPasswordDto,
  UpdateAdminUserDto,
} from './dto/user.dto';

@Injectable()
export class RbacUserService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.adminUser.findMany({
      orderBy: { id: 'asc' },
      select: {
        id: true,
        username: true,
        nickname: true,
        status: true,
        createdAt: true,
        roles: {
          include: { role: { select: { id: true, name: true, code: true } } },
        },
      },
    });
  }

  async create(dto: CreateAdminUserDto) {
    const exists = await this.prisma.adminUser.findUnique({
      where: { username: dto.username },
    });
    if (exists) throw new BadRequestException('用户名已存在');

    const hash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.adminUser.create({
      data: {
        username: dto.username,
        password: hash,
        nickname: dto.nickname,
        status: dto.status ?? 1,
      },
    });

    if (dto.roleIds?.length) {
      await this.prisma.adminUserRole.createMany({
        data: dto.roleIds.map((roleId) => ({ userId: user.id, roleId })),
      });
    }
    return this.findOne(user.id);
  }

  findOne(id: number) {
    return this.prisma.adminUser.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        nickname: true,
        status: true,
        createdAt: true,
        roles: {
          include: { role: { select: { id: true, name: true, code: true } } },
        },
      },
    });
  }

  async update(id: number, dto: UpdateAdminUserDto) {
    await this.ensureExists(id);
    const data: Record<string, unknown> = {};
    if (dto.nickname !== undefined) data.nickname = dto.nickname;
    if (dto.status !== undefined) data.status = dto.status;
    if (dto.password) data.password = await bcrypt.hash(dto.password, 10);

    await this.prisma.adminUser.update({ where: { id }, data });
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.ensureExists(id);
    return this.prisma.adminUser.delete({ where: { id } });
  }

  async assignRoles(id: number, dto: AssignUserRolesDto) {
    await this.ensureExists(id);
    await this.prisma.adminUserRole.deleteMany({ where: { userId: id } });
    if (dto.roleIds.length) {
      await this.prisma.adminUserRole.createMany({
        data: dto.roleIds.map((roleId) => ({ userId: id, roleId })),
      });
    }
    return this.findOne(id);
  }

  async resetPassword(id: number, dto: ResetPasswordDto) {
    await this.ensureExists(id);
    const hash = await bcrypt.hash(dto.password, 10);
    await this.prisma.adminUser.update({ where: { id }, data: { password: hash } });
    return { ok: true };
  }

  private async ensureExists(id: number) {
    const row = await this.prisma.adminUser.findUnique({ where: { id } });
    if (!row) throw new NotFoundException('用户不存在');
  }
}
