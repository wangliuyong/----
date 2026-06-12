import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import { serializeUser } from '../common/serializers';
import type { PhoneLoginDto, UpdateProfileDto, WechatLoginDto } from './dto/conv-auth.dto';

@Injectable()
export class ConvAuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  /** 签发 C 端 JWT */
  private async signToken(userId: number) {
    return this.jwtService.signAsync({ sub: userId, type: 'conv' });
  }

  /** 微信 code 登录（开发环境 mock：code 任意值均可登录/注册） */
  async wechatLogin(dto: WechatLoginDto) {
    const openId = `wx_${dto.code}`;
    let user = await this.prisma.convUser.findUnique({ where: { openId } });
    if (!user) {
      user = await this.prisma.convUser.create({
        data: {
          openId,
          nickname: `微信用户${Date.now().toString().slice(-4)}`,
          userType: 'USER',
          status: 'ACTIVE',
        },
      });
    }
    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('账号已被禁用');
    }
    return {
      accessToken: await this.signToken(user.id),
      user: serializeUser(user),
    };
  }

  /** 手机号密码登录 */
  async phoneLogin(dto: PhoneLoginDto) {
    const user = await this.prisma.convUser.findUnique({
      where: { phone: dto.phone },
    });
    if (!user?.password) {
      throw new UnauthorizedException('手机号或密码错误');
    }
    const ok = await bcrypt.compare(dto.password, user.password);
    if (!ok) {
      throw new UnauthorizedException('手机号或密码错误');
    }
    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('账号已被禁用');
    }
    return {
      accessToken: await this.signToken(user.id),
      user: serializeUser(user),
    };
  }

  /** 退出登录（客户端清除 token 即可，服务端无状态） */
  logout() {
    return null;
  }

  /** 获取用户资料 */
  async getProfile(userId: number) {
    const user = await this.prisma.convUser.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }
    return serializeUser(user);
  }

  /** 更新用户资料 */
  async updateProfile(userId: number, dto: UpdateProfileDto) {
    if (dto.phone) {
      const exists = await this.prisma.convUser.findFirst({
        where: { phone: dto.phone, NOT: { id: userId } },
      });
      if (exists) {
        throw new ConflictException('该手机号已被使用');
      }
    }
    const user = await this.prisma.convUser.update({
      where: { id: userId },
      data: {
        nickname: dto.nickname,
        avatar: dto.avatar,
        phone: dto.phone,
      },
    });
    return serializeUser(user);
  }

  /** 我的页概览统计 */
  async getMineOverview(userId: number) {
    const [collectCount, publishCount, pendingCount, aiSessionCount] =
      await Promise.all([
        this.prisma.convCollect.count({ where: { userId } }),
        this.prisma.convCityInfo.count({ where: { userId } }),
        this.prisma.convCityInfo.count({
          where: { userId, auditStatus: 'PENDING' },
        }),
        this.prisma.convAiSession.count({ where: { userId } }),
      ]);
    return { collectCount, publishCount, pendingCount, aiSessionCount };
  }
}
