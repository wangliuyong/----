import { Global, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RbacModule } from '../rbac/rbac.module';
import { AdminLogsController } from './admin-logs.controller';
import { AppLogService } from './app-log.service';
import { AuditLogInterceptor } from './audit-log.interceptor';
import { AuditLogService } from './audit-log.service';

/**
 * 全局日志模块：应用运行日志落库 + 管理后台审计拦截 + 日志查询 API。
 */
@Global()
@Module({
  imports: [RbacModule],
  controllers: [AdminLogsController],
  providers: [
    AppLogService,
    AuditLogService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditLogInterceptor,
    },
  ],
  exports: [AppLogService, AuditLogService],
})
export class LoggingModule {}
