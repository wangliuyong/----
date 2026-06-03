import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { syncRbacModules } from './rbac-sync';

/**
 * 应用启动时增量同步 RBAC 菜单与权限点。
 * 解决代码新增菜单后，已有数据库未执行 seed 导致侧栏不显示的问题。
 */
@Injectable()
export class RbacSyncService implements OnModuleInit {
  private readonly logger = new Logger(RbacSyncService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    try {
      await syncRbacModules(this.prisma);
      this.logger.log('RBAC 菜单与权限点已同步');
    } catch (err) {
      this.logger.error('RBAC 同步失败', err instanceof Error ? err.stack : err);
    }
  }
}
