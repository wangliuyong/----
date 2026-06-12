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
import { ConvNoticeService } from '../notice/conv-notice.service';
import { AdminNoticePayloadDto } from './dto/conv-admin.dto';

/** 便民公告管理 */
@Controller('api/admin/convenience/notices')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ConvAdminNoticeController {
  constructor(private readonly noticeService: ConvNoticeService) {}

  @Get()
  @RequirePermissions('admin:conv:notices:view')
  list() {
    return this.noticeService.findAdminList();
  }

  @Post()
  @RequirePermissions('admin:conv:notices:create')
  create(@Body() dto: AdminNoticePayloadDto) {
    return this.noticeService.createAdmin(dto);
  }

  @Put(':id')
  @RequirePermissions('admin:conv:notices:update')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AdminNoticePayloadDto,
  ) {
    return this.noticeService.updateAdmin(id, dto);
  }

  @Delete(':id')
  @RequirePermissions('admin:conv:notices:delete')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.noticeService.removeAdmin(id);
  }
}
