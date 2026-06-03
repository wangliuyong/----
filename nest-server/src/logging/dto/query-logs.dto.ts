import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

/** 分页查询公共参数 */
export class PaginatedQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number = 20;
}

/** 操作审计日志查询参数 */
export class QueryAuditLogsDto extends PaginatedQueryDto {
  /** 操作类型：create / update / delete / login 等 */
  @IsOptional()
  @IsString()
  action?: string;

  /** 操作人用户名（模糊匹配） */
  @IsOptional()
  @IsString()
  username?: string;

  /** 模块路径（模糊匹配） */
  @IsOptional()
  @IsString()
  module?: string;
}

/** 应用运行日志查询参数 */
export class QueryAppLogsDto extends PaginatedQueryDto {
  /** 日志级别：info / warn / error / debug / verbose */
  @IsOptional()
  @IsString()
  level?: string;

  /** 日志内容关键词（模糊匹配 message） */
  @IsOptional()
  @IsString()
  keyword?: string;
}
