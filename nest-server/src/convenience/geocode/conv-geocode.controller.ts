import { Controller, Get, Query } from '@nestjs/common';
import { ConvenienceApi } from '../common/convenience-api.decorator';
import { ConvPublic } from '../common/public.decorator';
import { ConvGeocodeService } from './conv-geocode.service';

/** 高德地图逆地理编码（公开，供各端统一调用） */
@ConvenienceApi()
@ConvPublic()
@Controller('api/geocode')
export class ConvGeocodeController {
  constructor(private readonly geocodeService: ConvGeocodeService) {}

  /** GET /api/geocode/reverse?lat=31.23&lng=121.47 */
  @Get('reverse')
  reverse(@Query('lat') lat: string, @Query('lng') lng: string) {
    return this.geocodeService.reverseGeocode(parseFloat(lat), parseFloat(lng));
  }
}
