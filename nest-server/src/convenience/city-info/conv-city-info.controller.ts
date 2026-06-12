import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { ConvenienceApi } from '../common/convenience-api.decorator';
import { CurrentConvUser } from '../common/current-user.decorator';
import {
  ConvJwtAuthGuard,
  ConvOptionalJwtAuthGuard,
} from '../auth/conv-jwt-auth.guard';
import { ConvCityInfoService } from './conv-city-info.service';
import {
  CityInfoPayloadDto,
  CityInfoQueryDto,
  MineCityInfoQueryDto,
} from './dto/city-info.dto';

/** 便民信息 CRUD 接口 */
@ConvenienceApi()
@Controller('api/city-info')
export class ConvCityInfoController {
  constructor(private readonly cityInfoService: ConvCityInfoService) {}

  /** 从可选 JWT 中解析用户 ID（公开列表也支持标记收藏状态） */
  private extractUserId(req: Request): number | undefined {
    const user = req.user as { userId?: number } | undefined;
    return user?.userId;
  }

  /** 分页列表（公开，登录后返回 collected 标记） */
  @UseGuards(ConvOptionalJwtAuthGuard)
  @Get()
  list(@Query() query: CityInfoQueryDto, @Req() req: Request) {
    return this.cityInfoService.findApprovedList(query, this.extractUserId(req));
  }

  /** 我的发布（须在 :id 之前注册） */
  @UseGuards(ConvJwtAuthGuard)
  @Get('mine')
  mine(
    @CurrentConvUser() user: { userId: number },
    @Query() query: MineCityInfoQueryDto,
  ) {
    return this.cityInfoService.findMineList(
      user.userId,
      query.page || 1,
      query.pageSize || 10,
    );
  }

  /** 详情（公开，登录后返回 collected 标记） */
  @UseGuards(ConvOptionalJwtAuthGuard)
  @Get(':id')
  detail(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    return this.cityInfoService.findOne(id, this.extractUserId(req));
  }

  /** 发布信息 */
  @UseGuards(ConvJwtAuthGuard)
  @Post()
  create(
    @CurrentConvUser() user: { userId: number },
    @Body() dto: CityInfoPayloadDto,
  ) {
    return this.cityInfoService.create(user.userId, dto);
  }

  /** 删除信息 */
  @UseGuards(ConvJwtAuthGuard)
  @Delete(':id')
  remove(
    @CurrentConvUser() user: { userId: number },
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.cityInfoService.remove(user.userId, id);
  }
}
