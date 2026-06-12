import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RequirePermissions } from '../../rbac/decorators/require-permissions.decorator';
import { PermissionsGuard } from '../../rbac/guards/permissions.guard';
import { ConvCityInfoService } from '../city-info/conv-city-info.service';
import {
  AdminCityInfoAuditDto,
  AdminCityInfoQueryDto,
} from './dto/conv-admin.dto';

/** 便民信息管理（审核） */
@Controller('api/admin/convenience/city-info')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ConvAdminCityInfoController {
  constructor(private readonly cityInfoService: ConvCityInfoService) {}

  @Get()
  @RequirePermissions('admin:conv:city-info:view')
  list(@Query() query: AdminCityInfoQueryDto) {
    return this.cityInfoService.findAdminList(query);
  }

  @Get(':id')
  @RequirePermissions('admin:conv:city-info:view')
  detail(@Param('id', ParseIntPipe) id: number) {
    return this.cityInfoService.findAdminOne(id);
  }

  @Put(':id/audit')
  @RequirePermissions('admin:conv:city-info:audit')
  audit(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AdminCityInfoAuditDto,
  ) {
    return this.cityInfoService.audit(id, dto.auditStatus);
  }

  @Delete(':id')
  @RequirePermissions('admin:conv:city-info:delete')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.cityInfoService.adminRemove(id);
  }
}
