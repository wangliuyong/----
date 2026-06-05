import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequirePermissions } from '../rbac/decorators/require-permissions.decorator';
import { PermissionsGuard } from '../rbac/guards/permissions.guard';
import { DashboardService } from './dashboard.service';

/** 管理后台首页概览 API */
@Controller('api/admin/dashboard')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  /** 首页聚合数据：内容、互动、日志、服务器运行时 */
  @Get('overview')
  @RequirePermissions('admin:dashboard:view')
  getOverview() {
    return this.dashboardService.getOverview();
  }
}
