import { Controller, Get } from '@nestjs/common';
import { ConvenienceApi } from '../common/convenience-api.decorator';
import { ConvPublic } from '../common/public.decorator';
import { ConvBannerService } from './conv-banner.service';

/** 首页轮播图接口 */
@ConvenienceApi()
@ConvPublic()
@Controller('api/banners')
export class ConvBannerController {
  constructor(private readonly bannerService: ConvBannerService) {}

  @Get()
  list() {
    return this.bannerService.findOnlineList();
  }
}
