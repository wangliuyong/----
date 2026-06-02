import { Module } from '@nestjs/common';
import { PermissionsGuard } from './guards/permissions.guard';
import { ModuleService } from './module.service';
import { PermissionService } from './permission.service';
import { RbacController } from './rbac.controller';
import { RbacQueryService } from './rbac-query.service';
import { RbacUserService } from './rbac-user.service';
import { RoleService } from './role.service';

@Module({
  controllers: [RbacController],
  providers: [
    RbacQueryService,
    ModuleService,
    PermissionService,
    RoleService,
    RbacUserService,
    PermissionsGuard,
  ],
  exports: [RbacQueryService, PermissionsGuard],
})
export class RbacModule {}
