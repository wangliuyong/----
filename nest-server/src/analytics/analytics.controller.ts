import { Body, Controller, Post } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { RecordPageViewDto } from './dto/record-page-view.dto';

/** 前台访问统计 API（公开，无需登录） */
@Controller('api/analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  /** 页面浏览上报（由 next-host 路由切换时调用） */
  @Post('pageview')
  recordPageView(@Body() dto: RecordPageViewDto) {
    return this.analyticsService.recordPageView(dto);
  }
}
