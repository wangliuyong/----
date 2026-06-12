import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RequirePermissions } from '../../rbac/decorators/require-permissions.decorator';
import { PermissionsGuard } from '../../rbac/guards/permissions.guard';
import { ConvReportService } from '../report/conv-report.service';
import {
  AdminConvUserQueryDto,
  AdminConvUserResetPasswordDto,
  AdminConvUserUpdateDto,
  AdminReportQueryDto,
} from './dto/conv-admin.dto';
import { ConvAdminUserService } from './conv-admin-user.service';

/** 便民举报管理 */
@Controller('api/admin/convenience/reports')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ConvAdminReportController {
  constructor(private readonly reportService: ConvReportService) {}

  @Get()
  @RequirePermissions('admin:conv:reports:view')
  list(@Query() query: AdminReportQueryDto) {
    return this.reportService.findAdminList(query);
  }

  @Delete(':id')
  @RequirePermissions('admin:conv:reports:delete')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.reportService.removeAdmin(id);
  }
}

/** 便民 C 端用户管理 */
@Controller('api/admin/convenience/users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ConvAdminUserController {
  constructor(private readonly userService: ConvAdminUserService) {}

  @Get()
  @RequirePermissions('admin:conv:users:view')
  list(@Query() query: AdminConvUserQueryDto) {
    return this.userService.findList(query);
  }

  @Get(':id')
  @RequirePermissions('admin:conv:users:view')
  detail(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Put(':id')
  @RequirePermissions('admin:conv:users:update')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AdminConvUserUpdateDto,
  ) {
    return this.userService.update(id, dto);
  }

  @Put(':id/reset-password')
  @RequirePermissions('admin:conv:users:reset-password')
  resetPassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AdminConvUserResetPasswordDto,
  ) {
    return this.userService.resetPassword(id, dto);
  }
}
