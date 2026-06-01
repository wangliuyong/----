import { Controller, Get } from '@nestjs/common';
import { SiteService } from './site.service';

/** 站点配置公开接口（无需鉴权） */
@Controller('api/site')
export class SiteController {
  constructor(private readonly siteService: SiteService) {}

  @Get('config')
  getConfig() {
    return this.siteService.getPublicConfig();
  }
}
