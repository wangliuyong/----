import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import { serializeUser } from '../common/serializers';
import type {
  AdminConvUserQueryDto,
  AdminConvUserResetPasswordDto,
  AdminConvUserUpdateDto,
} from './dto/conv-admin.dto';
import { pageResult } from '../common/serializers';

@Injectable()
export class ConvAdminUserService {
  constructor(private readonly prisma: PrismaService) {}

  /** 分页查询 C 端用户 */
  async findList(query: AdminConvUserQueryDto) {
    const page = query.page || 1;
    const pageSize = query.pageSize || 10;
    const where: {
      userType?: string;
      status?: string;
      OR?: Array<{ nickname?: { contains: string }; phone?: { contains: string } }>;
    } = {};

    if (query.userType) where.userType = query.userType;
    if (query.status) where.status = query.status;
    if (query.keyword?.trim()) {
      const kw = query.keyword.trim();
      where.OR = [{ nickname: { contains: kw } }, { phone: { contains: kw } }];
    }

    const [total, rows] = await Promise.all([
      this.prisma.convUser.count({ where }),
      this.prisma.convUser.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    const list = await Promise.all(
      rows.map(async (user) => {
        const publishCount = await this.prisma.convCityInfo.count({
          where: { userId: user.id },
        });
        return { ...serializeUser(user), publishCount };
      }),
    );

    return pageResult(list, total, page, pageSize);
  }

  /** 用户详情 */
  async findOne(id: number) {
    const user = await this.prisma.convUser.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    const [publishCount, pendingCount] = await Promise.all([
      this.prisma.convCityInfo.count({ where: { userId: id } }),
      this.prisma.convCityInfo.count({
        where: { userId: id, auditStatus: 'PENDING' },
      }),
    ]);
    return { ...serializeUser(user), publishCount, pendingCount };
  }

  /** 更新用户状态/类型 */
  async update(id: number, dto: AdminConvUserUpdateDto) {
    await this.ensureExists(id);
    const user = await this.prisma.convUser.update({
      where: { id },
      data: {
        nickname: dto.nickname,
        userType: dto.userType,
        status: dto.status,
      },
    });
    return serializeUser(user);
  }

  /** 重置手机号用户密码 */
  async resetPassword(id: number, dto: AdminConvUserResetPasswordDto) {
    const user = await this.ensureExists(id);
    if (!user.phone) {
      throw new BadRequestException('该用户未绑定手机号，无法重置密码');
    }
    const password = await bcrypt.hash(dto.password, 10);
    await this.prisma.convUser.update({
      where: { id },
      data: { password },
    });
    return { ok: true };
  }

  private async ensureExists(id: number) {
    const user = await this.prisma.convUser.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    return user;
  }
}
