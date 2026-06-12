import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { CONV_PUBLIC_KEY } from '../common/public.decorator';

/**
 * 可选 JWT 鉴权：有 token 则解析用户，无 token 也放行。
 * 用于公开列表/详情接口，登录用户可额外获得 collected 等字段。
 */
@Injectable()
export class ConvOptionalJwtAuthGuard extends AuthGuard('conv-jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context) as Promise<boolean>;
  }

  handleRequest<TUser>(err: Error | null, user: TUser): TUser {
    if (err || !user) {
      return undefined as TUser;
    }
    return user;
  }
}

/** 必须登录的 JWT 守卫 */
@Injectable()
export class ConvJwtAuthGuard extends AuthGuard('conv-jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(CONV_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }
}
