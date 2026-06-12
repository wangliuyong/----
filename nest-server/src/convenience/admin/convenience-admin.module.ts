import { Module } from '@nestjs/common';
import { RbacModule } from '../../rbac/rbac.module';
import { ConvBannerService } from '../banner/conv-banner.service';
import { ConvCategoryService } from '../category/conv-category.service';
import { ConvCityInfoService } from '../city-info/conv-city-info.service';
import { ConvNoticeService } from '../notice/conv-notice.service';
import { ConvReportService } from '../report/conv-report.service';
import { ConvAdminBannerController } from './conv-admin-banner.controller';
import { ConvAdminCategoryController } from './conv-admin-category.controller';
import { ConvAdminCityInfoController } from './conv-admin-city-info.controller';
import { ConvAdminDashboardController } from './conv-admin-dashboard.controller';
import { ConvAdminDashboardService } from './conv-admin-dashboard.service';
import { ConvAdminNoticeController } from './conv-admin-notice.controller';
import {
  ConvAdminReportController,
  ConvAdminUserController,
} from './conv-admin-report.controller';
import { ConvAdminUserService } from './conv-admin-user.service';

/** 同城便民管理后台 API（JWT + RBAC，不走 C 端响应包装） */
@Module({
  imports: [RbacModule],
  controllers: [
    ConvAdminDashboardController,
    ConvAdminCityInfoController,
    ConvAdminCategoryController,
    ConvAdminBannerController,
    ConvAdminNoticeController,
    ConvAdminReportController,
    ConvAdminUserController,
  ],
  providers: [
    ConvCityInfoService,
    ConvCategoryService,
    ConvBannerService,
    ConvNoticeService,
    ConvReportService,
    ConvAdminUserService,
    ConvAdminDashboardService,
  ],
})
export class ConvenienceAdminModule {}
