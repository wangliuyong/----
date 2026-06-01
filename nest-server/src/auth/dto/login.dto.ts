import { IsNotEmpty, IsString } from 'class-validator';

/** 登录请求体 */
export class LoginDto {
  @IsString()
  @IsNotEmpty()
  username!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}
