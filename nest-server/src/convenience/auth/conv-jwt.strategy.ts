import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

/** C 端 JWT 载荷 */
export interface ConvJwtPayload {
  sub: number;
  /** 固定为 conv，区分管理端 JWT */
  type: 'conv';
}

/** C 端用户 JWT 策略 */
@Injectable()
export class ConvJwtStrategy extends PassportStrategy(Strategy, 'conv-jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'personal-site-dev-secret',
    });
  }

  validate(payload: ConvJwtPayload) {
    if (payload.type !== 'conv') {
      throw new UnauthorizedException('无效的登录凭证');
    }
    return { userId: payload.sub };
  }
}
