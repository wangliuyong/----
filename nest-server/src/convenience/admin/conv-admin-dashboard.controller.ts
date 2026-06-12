import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RequirePermissions } from '../../rbac/decorators/require-permissions.decorator';
import { PermissionsGuard } from '../../rbac/guards/permissions.guard';
import { ConvAdminDashboardService } from './conv-admin-dashboard.service';

/** 便民业务概览 */
@Controller('api/admin/convenience/dashboard')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ConvAdminDashboardController {
  constructor(private readonly dashboardService: ConvAdminDashboardService) {}

  @Get('overview')
  @RequirePermissions('admin:conv:dashboard:view')
  overview() {
    return this.dashboardService.getOverview();
  }
}
