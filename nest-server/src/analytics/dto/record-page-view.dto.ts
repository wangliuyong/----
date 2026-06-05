import { IsOptional, IsString, MaxLength } from 'class-validator';

/** 前台页面访问上报 DTO（由 app-web 子应用上报） */
export class RecordPageViewDto {
  @IsString()
  @MaxLength(512)
  path!: string;

  @IsOptional()
  @IsString()
  @MaxLength(1024)
  referrer?: string;

  @IsOptional()
  @IsString()
  @MaxLength(32)
  locale?: string;

  @IsOptional()
  @IsString()
  @MaxLength(64)
  timezone?: string;
}
