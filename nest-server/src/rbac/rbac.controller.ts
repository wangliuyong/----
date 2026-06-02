import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequirePermissions } from './decorators/require-permissions.decorator';
import { PermissionsGuard } from './guards/permissions.guard';
import { CreateModuleDto, UpdateModuleDto } from './dto/module.dto';
import { CreatePermissionDto, UpdatePermissionDto } from './dto/permission.dto';
import { AssignRolePermissionsDto, CreateRoleDto, UpdateRoleDto } from './dto/role.dto';
import {
  AssignUserRolesDto,
  CreateAdminUserDto,
  ResetPasswordDto,
  UpdateAdminUserDto,
} from './dto/user.dto';
import { ModuleService } from './module.service';
import { PermissionService } from './permission.service';
import { RbacQueryService } from './rbac-query.service';
import { RbacUserService } from './rbac-user.service';
import { RoleService } from './role.service';

/** RBAC 管理 API */
@Controller('api/admin')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class RbacController {
  constructor(
    private readonly rbacQuery: RbacQueryService,
    private readonly moduleService: ModuleService,
    private readonly permissionService: PermissionService,
    private readonly roleService: RoleService,
    private readonly userService: RbacUserService,
  ) {}

  /** 当前登录用户 profile：权限码 + 侧栏菜单树 */
  @Get('auth/profile')
  async profile(@Req() req: { user: { userId: number; username: string } }) {
    const userId = req.user.userId;
    const { isSuper, permissionCodes } =
      await this.rbacQuery.getUserPermissionContext(userId);
    const menus = await this.rbacQuery.getUserMenuTree(userId);
    const user = await this.userService.findOne(userId);
    return {
      id: userId,
      username: req.user.username,
      nickname: user?.nickname,
      isSuper,
      permissionCodes,
      menus,
    };
  }

  // ---------- 模块 ----------
  @Get('rbac/modules')
  @RequirePermissions('admin:system:modules:view')
  listModules() {
    return this.moduleService.findTree();
  }

  @Post('rbac/modules')
  @RequirePermissions('admin:system:modules:create')
  createModule(@Body() dto: CreateModuleDto) {
    return this.moduleService.create(dto);
  }

  @Put('rbac/modules/:id')
  @RequirePermissions('admin:system:modules:update')
  updateModule(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateModuleDto) {
    return this.moduleService.update(id, dto);
  }

  @Delete('rbac/modules/:id')
  @RequirePermissions('admin:system:modules:delete')
  deleteModule(@Param('id', ParseIntPipe) id: number) {
    return this.moduleService.remove(id);
  }

  // ---------- 权限点 ----------
  @Get('rbac/modules/:id/permissions')
  @RequirePermissions('admin:system:modules:view')
  listPermissions(@Param('id', ParseIntPipe) moduleId: number) {
    return this.permissionService.listByModule(moduleId);
  }

  @Post('rbac/modules/:id/permissions')
  @RequirePermissions('admin:system:modules:update')
  createPermission(
    @Param('id', ParseIntPipe) moduleId: number,
    @Body() dto: CreatePermissionDto,
  ) {
    return this.permissionService.create(moduleId, dto);
  }

  @Put('rbac/permissions/:id')
  @RequirePermissions('admin:system:modules:update')
  updatePermission(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePermissionDto,
  ) {
    return this.permissionService.update(id, dto);
  }

  @Delete('rbac/permissions/:id')
  @RequirePermissions('admin:system:modules:delete')
  deletePermission(@Param('id', ParseIntPipe) id: number) {
    return this.permissionService.remove(id);
  }

  @Get('rbac/permission-tree')
  @RequirePermissions('admin:system:roles:view')
  permissionTree() {
    return this.rbacQuery.getPermissionAssignTree();
  }

  // ---------- 角色 ----------
  @Get('rbac/roles')
  @RequirePermissions('admin:system:roles:view')
  listRoles() {
    return this.roleService.findAll();
  }

  @Post('rbac/roles')
  @RequirePermissions('admin:system:roles:create')
  createRole(@Body() dto: CreateRoleDto) {
    return this.roleService.create(dto);
  }

  @Put('rbac/roles/:id')
  @RequirePermissions('admin:system:roles:update')
  updateRole(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRoleDto) {
    return this.roleService.update(id, dto);
  }

  @Delete('rbac/roles/:id')
  @RequirePermissions('admin:system:roles:delete')
  deleteRole(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.remove(id);
  }

  @Put('rbac/roles/:id/permissions')
  @RequirePermissions('admin:system:roles:assign')
  assignRolePermissions(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AssignRolePermissionsDto,
  ) {
    return this.roleService.assignPermissions(id, dto);
  }

  // ---------- 用户 ----------
  @Get('rbac/users')
  @RequirePermissions('admin:system:users:view')
  listUsers() {
    return this.userService.findAll();
  }

  @Post('rbac/users')
  @RequirePermissions('admin:system:users:create')
  createUser(@Body() dto: CreateAdminUserDto) {
    return this.userService.create(dto);
  }

  @Put('rbac/users/:id')
  @RequirePermissions('admin:system:users:update')
  updateUser(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAdminUserDto) {
    return this.userService.update(id, dto);
  }

  @Delete('rbac/users/:id')
  @RequirePermissions('admin:system:users:delete')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }

  @Put('rbac/users/:id/roles')
  @RequirePermissions('admin:system:users:assign')
  assignUserRoles(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AssignUserRolesDto,
  ) {
    return this.userService.assignRoles(id, dto);
  }

  @Put('rbac/users/:id/reset-password')
  @RequirePermissions('admin:system:users:reset-password')
  resetPassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ResetPasswordDto,
  ) {
    return this.userService.resetPassword(id, dto);
  }
}
