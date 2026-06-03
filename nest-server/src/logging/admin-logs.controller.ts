import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequirePermissions } from '../rbac/decorators/require-permissions.decorator';
import { PermissionsGuard } from '../rbac/guards/permissions.guard';
import { AppLogService } from './app-log.service';
import { AuditLogService } from './audit-log.service';
import { QueryAppLogsDto, QueryAuditLogsDto } from './dto/query-logs.dto';

/**
 * 管理后台日志查询 API（需 JWT + 权限点）。
 * - 操作审计日志：记录后台写操作与登录
 * - 应用运行日志：仅持久化 Nest 运行期 error
 */
@Controller('api/admin/logs')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AdminLogsController {
  constructor(
    private readonly auditLog: AuditLogService,
    private readonly appLog: AppLogService,
  ) {}

  /** 分页查询操作审计日志 */
  @Get('audit')
  @RequirePermissions('admin:logs:audit:view')
  listAuditLogs(@Query() query: QueryAuditLogsDto) {
    return this.auditLog.findPage(query);
  }

  /** 分页查询应用错误日志（仅 error） */
  @Get('app')
  @RequirePermissions('admin:logs:app:view')
  listAppLogs(@Query() query: QueryAppLogsDto) {
    return this.appLog.findPage(query);
  }
}
