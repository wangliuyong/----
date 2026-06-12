import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ConvenienceApi } from '../common/convenience-api.decorator';
import { ConvPublic } from '../common/public.decorator';
import { ConvNoticeService } from './conv-notice.service';

/** 平台公告接口 */
@ConvenienceApi()
@ConvPublic()
@Controller('api/notices')
export class ConvNoticeController {
  constructor(private readonly noticeService: ConvNoticeService) {}

  @Get()
  list() {
    return this.noticeService.findPublishedList();
  }

  @Get(':id')
  detail(@Param('id', ParseIntPipe) id: number) {
    return this.noticeService.findOne(id);
  }
}
