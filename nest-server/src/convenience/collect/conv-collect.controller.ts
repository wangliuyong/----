import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ConvenienceApi } from '../common/convenience-api.decorator';
import { CurrentConvUser } from '../common/current-user.decorator';
import { ConvJwtAuthGuard } from '../auth/conv-jwt-auth.guard';
import { ConvCollectService } from './conv-collect.service';
import { CollectDto, CollectQueryDto } from './dto/collect.dto';

/** 收藏接口 */
@ConvenienceApi()
@UseGuards(ConvJwtAuthGuard)
@Controller('api/collects')
export class ConvCollectController {
  constructor(private readonly collectService: ConvCollectService) {}

  @Get()
  list(
    @CurrentConvUser() user: { userId: number },
    @Query() query: CollectQueryDto,
  ) {
    return this.collectService.findList(
      user.userId,
      query.page || 1,
      query.pageSize || 10,
    );
  }

  @Post()
  collect(
    @CurrentConvUser() user: { userId: number },
    @Body() dto: CollectDto,
  ) {
    return this.collectService.collect(user.userId, dto.infoId);
  }

  @Get('ids')
  ids(@CurrentConvUser() user: { userId: number }) {
    return this.collectService.findCollectedIds(user.userId);
  }

  @Delete(':infoId')
  uncollect(
    @CurrentConvUser() user: { userId: number },
    @Param('infoId', ParseIntPipe) infoId: number,
  ) {
    return this.collectService.uncollect(user.userId, infoId);
  }
}
