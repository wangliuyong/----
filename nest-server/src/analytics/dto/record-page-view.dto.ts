import { IsOptional, IsString, MaxLength } from 'class-validator';

/** 前台页面访问上报 DTO */
export class RecordPageViewDto {
  @IsString()
  @MaxLength(512)
  path!: string;

  @IsOptional()
  @IsString()
  @MaxLength(1024)
  referrer?: string;
}
