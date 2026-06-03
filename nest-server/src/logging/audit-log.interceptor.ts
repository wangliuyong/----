import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { AuditLogService } from './audit-log.service';

/** 从 HTTP 方法与路径解析审计动作描述 */
function resolveAuditAction(method: string, path: string): { action: string; module: string } {
  const segments = path.replace(/^\/api\/admin\/?/, '').split('/').filter(Boolean);
  const module = segments[0] ?? 'admin';
  const resource = segments.join('/');

  switch (method) {
    case 'POST':
      return { action: 'create', module: resource || module };
    case 'PUT':
    case 'PATCH':
      return { action: 'update', module: resource || module };
    case 'DELETE':
      return { action: 'delete', module: resource || module };
    default:
      return { action: method.toLowerCase(), module: resource || module };
  }
}

/**
 * 拦截 /api/admin 写操作，成功后写入 AdminAuditLog。
 */
@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(private readonly auditLog: AuditLogService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest<{
      method: string;
      path: string;
      url: string;
      user?: { userId: number; username: string };
      ip?: string;
      headers?: { 'x-forwarded-for'?: string };
      params?: Record<string, string>;
      body?: Record<string, unknown>;
    }>();

    const method = req.method?.toUpperCase() ?? 'GET';
    const path = req.path ?? req.url?.split('?')[0] ?? '';

    /** 仅记录写操作 */
    if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      return next.handle();
    }

    /** 登录接口单独处理 */
    if (path.includes('/auth/login')) {
      return next.handle().pipe(
        tap(() => {
          void this.auditLog.write({
            username: String(req.body?.username ?? ''),
            action: 'login',
            module: 'auth',
            ip: req.headers?.['x-forwarded-for'] ?? req.ip,
          });
        }),
      );
    }

    const { action, module } = resolveAuditAction(method, path);
    const targetId = req.params?.id ?? undefined;

    return next.handle().pipe(
      tap(() => {
        void this.auditLog.write({
          userId: req.user?.userId,
          username: req.user?.username,
          action,
          module,
          targetId,
          detail: JSON.stringify(req.body ?? {}).slice(0, 500),
          ip: req.headers?.['x-forwarded-for'] ?? req.ip,
        });
      }),
    );
  }
}
