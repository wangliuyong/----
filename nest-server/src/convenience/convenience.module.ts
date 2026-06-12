import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConvApiExceptionFilter } from './common/api-exception.filter';
import { ConvApiResponseInterceptor } from './common/api-response.interceptor';
import { ConvAuthController } from './auth/conv-auth.controller';
import { ConvAuthService } from './auth/conv-auth.service';
import { ConvJwtStrategy } from './auth/conv-jwt.strategy';
import { ConvBannerController } from './banner/conv-banner.controller';
import { ConvBannerService } from './banner/conv-banner.service';
import { ConvCategoryController } from './category/conv-category.controller';
import { ConvCategoryService } from './category/conv-category.service';
import { ConvCityInfoController } from './city-info/conv-city-info.controller';
import { ConvCityInfoService } from './city-info/conv-city-info.service';
import { ConvCollectController } from './collect/conv-collect.controller';
import { ConvCollectService } from './collect/conv-collect.service';
import { ConvNoticeController } from './notice/conv-notice.controller';
import { ConvNoticeService } from './notice/conv-notice.service';
import { ConvReportController } from './report/conv-report.controller';
import { ConvReportService } from './report/conv-report.service';
import { ConvAiController } from './ai/conv-ai.controller';
import { ConvAiService } from './ai/conv-ai.service';
import { ConvUploadController } from './upload/conv-upload.controller';
import { ConvUploadService } from './upload/conv-upload.service';

/** 同城便民 C 端 API 模块 */
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'conv-jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'personal-site-dev-secret',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [
    ConvAuthController,
    ConvBannerController,
    ConvCategoryController,
    ConvNoticeController,
    ConvCityInfoController,
    ConvCollectController,
    ConvReportController,
    ConvAiController,
    ConvUploadController,
  ],
  providers: [
    ConvAuthService,
    ConvJwtStrategy,
    ConvBannerService,
    ConvCategoryService,
    ConvNoticeService,
    ConvCityInfoService,
    ConvCollectService,
    ConvReportService,
    ConvAiService,
    ConvUploadService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ConvApiResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: ConvApiExceptionFilter,
    },
  ],
  exports: [ConvAiService, ConvAuthService],
})
export class ConvenienceModule {}
