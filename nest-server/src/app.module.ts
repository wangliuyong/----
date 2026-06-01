import { Module } from '@nestjs/common';
import { ArticleModule } from './article/article.module';
import { LinkModule } from './link/link.module';
import { MessageModule } from './message/message.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProjectModule } from './project/project.module';

@Module({
  imports: [
    PrismaModule,
    ArticleModule,
    ProjectModule,
    MessageModule,
    LinkModule,
  ],
})
export class AppModule {}
