import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ConvenienceApi } from '../common/convenience-api.decorator';
import { CurrentConvUser } from '../common/current-user.decorator';
import { ConvJwtAuthGuard } from '../auth/conv-jwt-auth.guard';
import { ReportDto } from '../collect/dto/collect.dto';
import { ConvReportService } from './conv-report.service';

/** 举报接口 */
@ConvenienceApi()
@UseGuards(ConvJwtAuthGuard)
@Controller('api/reports')
export class ConvReportController {
  constructor(private readonly reportService: ConvReportService) {}

  @Post()
  create(
    @CurrentConvUser() user: { userId: number },
    @Body() dto: ReportDto,
  ) {
    return this.reportService.create(user.userId, dto);
  }
}
