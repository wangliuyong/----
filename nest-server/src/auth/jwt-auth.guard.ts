import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/** 管理接口 JWT 鉴权守卫 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
