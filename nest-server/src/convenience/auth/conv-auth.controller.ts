import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { ConvenienceApi } from '../common/convenience-api.decorator';
import { CurrentConvUser } from '../common/current-user.decorator';
import { ConvPublic } from '../common/public.decorator';
import { ConvJwtAuthGuard } from './conv-jwt-auth.guard';
import { ConvAuthService } from './conv-auth.service';
import { PhoneLoginDto, UpdateProfileDto, WechatLoginDto } from './dto/conv-auth.dto';

/** C 端认证与用户资料接口 */
@ConvenienceApi()
@Controller('api')
export class ConvAuthController {
  constructor(private readonly authService: ConvAuthService) {}

  /** 微信 code 登录 */
  @ConvPublic()
  @Post('auth/wechat-login')
  wechatLogin(@Body() dto: WechatLoginDto) {
    return this.authService.wechatLogin(dto);
  }

  /** 手机号密码登录 */
  @ConvPublic()
  @Post('auth/phone-login')
  phoneLogin(@Body() dto: PhoneLoginDto) {
    return this.authService.phoneLogin(dto);
  }

  /** 退出登录 */
  @UseGuards(ConvJwtAuthGuard)
  @Post('auth/logout')
  logout() {
    return this.authService.logout();
  }

  /** 获取当前用户资料 */
  @UseGuards(ConvJwtAuthGuard)
  @Get('user/profile')
  profile(@CurrentConvUser() user: { userId: number }) {
    return this.authService.getProfile(user.userId);
  }

  /** 更新用户资料 */
  @UseGuards(ConvJwtAuthGuard)
  @Put('user/profile')
  updateProfile(
    @CurrentConvUser() user: { userId: number },
    @Body() dto: UpdateProfileDto,
  ) {
    return this.authService.updateProfile(user.userId, dto);
  }

  /** 我的页概览统计 */
  @UseGuards(ConvJwtAuthGuard)
  @Get('user/mine-overview')
  mineOverview(@CurrentConvUser() user: { userId: number }) {
    return this.authService.getMineOverview(user.userId);
  }
}
