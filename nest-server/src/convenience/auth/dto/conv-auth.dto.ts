import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

/** 微信 code 登录 */
export class WechatLoginDto {
  @IsString()
  @IsNotEmpty()
  code!: string;
}

/** 手机号密码登录 */
export class PhoneLoginDto {
  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}

/** 更新用户资料 */
export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  nickname?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  avatar?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;
}
