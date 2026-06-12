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
import { ConvCategoryService } from '../category/conv-category.service';
import {
  AdminCategoryCreateDto,
  AdminCategoryUpdateDto,
} from './dto/conv-admin.dto';

/** 便民分类管理 */
@Controller('api/admin/convenience/categories')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ConvAdminCategoryController {
  constructor(private readonly categoryService: ConvCategoryService) {}

  @Get('tree')
  @RequirePermissions('admin:conv:categories:view')
  tree() {
    return this.categoryService.findAdminTree();
  }

  @Get()
  @RequirePermissions('admin:conv:categories:view')
  list() {
    return this.categoryService.findAdminFlatList();
  }

  @Post()
  @RequirePermissions('admin:conv:categories:create')
  create(@Body() dto: AdminCategoryCreateDto) {
    return this.categoryService.createAdmin(dto);
  }

  @Put(':id')
  @RequirePermissions('admin:conv:categories:update')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AdminCategoryUpdateDto,
  ) {
    return this.categoryService.updateAdmin(id, dto);
  }

  @Delete(':id')
  @RequirePermissions('admin:conv:categories:delete')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.removeAdmin(id);
  }
}
