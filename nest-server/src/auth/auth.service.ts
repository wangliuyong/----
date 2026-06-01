import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  /** 校验账号密码并签发 JWT */
  async login(dto: LoginDto) {
    const user = await this.prisma.adminUser.findUnique({
      where: { username: dto.username },
    });
    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    const ok = await bcrypt.compare(dto.password, user.password);
    if (!ok) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    const payload = { sub: user.id, username: user.username };
    return {
      accessToken: await this.jwtService.signAsync(payload),
      username: user.username,
    };
  }

  /** 创建管理员（seed 使用） */
  async createAdmin(username: string, plainPassword: string) {
    const hash = await bcrypt.hash(plainPassword, 10);
    return this.prisma.adminUser.upsert({
      where: { username },
      update: { password: hash },
      create: { username, password: hash },
    });
  }
}
