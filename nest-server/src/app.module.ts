import { Module } from '@nestjs/common';
import { AiModule } from './ai/ai.module';
import { ArticleModule } from './article/article.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { LinkModule } from './link/link.module';
import { LoggingModule } from './logging/logging.module';
import { MessageModule } from './message/message.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProjectModule } from './project/project.module';
import { RbacModule } from './rbac/rbac.module';
import { SiteModule } from './site/site.module';

@Module({
  imports: [
    PrismaModule,
    LoggingModule,
    AuthModule,
    RbacModule,
    SiteModule,
    AdminModule,
    ArticleModule,
    ProjectModule,
    MessageModule,
    LinkModule,
    AiModule,
  ],
})
export class AppModule {}
