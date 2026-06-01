import { Module } from '@nestjs/common';
import { ArticleModule } from './article/article.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { LinkModule } from './link/link.module';
import { MessageModule } from './message/message.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProjectModule } from './project/project.module';
import { SiteModule } from './site/site.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    SiteModule,
    AdminModule,
    ArticleModule,
    ProjectModule,
    MessageModule,
    LinkModule,
  ],
})
export class AppModule {}
