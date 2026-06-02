import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/require-permissions.decorator';
import { RbacQueryService } from '../rbac-query.service';

/** 校验 JWT 用户是否拥有接口所需权限（超管角色直接放行） */
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly rbacQuery: RbacQueryService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const required = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required?.length) return true;

    const req = context.switchToHttp().getRequest();
    const userId = req.user?.userId as number | undefined;
    if (!userId) return false;

    const { isSuper, permissionCodes } =
      await this.rbacQuery.getUserPermissionContext(userId);

    if (isSuper) return true;

    const ok = required.some((code) => permissionCodes.includes(code));
    if (!ok) {
      throw new ForbiddenException('无权限执行此操作');
    }
    return true;
  }
}
