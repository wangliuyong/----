import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/** 从 JWT 解析出的 C 端用户上下文 */
export interface ConvUserPayload {
  userId: number;
}

/** 获取当前登录的 C 端用户 ID */
export const CurrentConvUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): ConvUserPayload => {
    const request = ctx.switchToHttp().getRequest<{ user?: ConvUserPayload }>();
    return request.user!;
  },
);
