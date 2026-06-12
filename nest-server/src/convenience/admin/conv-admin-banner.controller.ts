import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RequirePermissions } from '../../rbac/decorators/require-permissions.decorator';
import { PermissionsGuard } from '../../rbac/guards/permissions.guard';
import { ConvBannerService } from '../banner/conv-banner.service';
import { AdminBannerPayloadDto } from './dto/conv-admin.dto';

/** 便民轮播图管理 */
@Controller('api/admin/convenience/banners')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ConvAdminBannerController {
  constructor(private readonly bannerService: ConvBannerService) {}

  @Get()
  @RequirePermissions('admin:conv:banners:view')
  list() {
    return this.bannerService.findAdminList();
  }

  @Post()
  @RequirePermissions('admin:conv:banners:create')
  create(@Body() dto: AdminBannerPayloadDto) {
    return this.bannerService.createAdmin(dto);
  }

  @Put(':id')
  @RequirePermissions('admin:conv:banners:update')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AdminBannerPayloadDto,
  ) {
    return this.bannerService.updateAdmin(id, dto);
  }

  @Delete(':id')
  @RequirePermissions('admin:conv:banners:delete')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.bannerService.removeAdmin(id);
  }
}
