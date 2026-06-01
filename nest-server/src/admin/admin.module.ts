import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { ArticleModule } from '../article/article.module';
import { LinkModule } from '../link/link.module';
import { MessageModule } from '../message/message.module';
import { ProjectModule } from '../project/project.module';
import { SiteModule } from '../site/site.module';

@Module({
  imports: [SiteModule, ArticleModule, ProjectModule, LinkModule, MessageModule],
  controllers: [AdminController],
})
export class AdminModule {}
