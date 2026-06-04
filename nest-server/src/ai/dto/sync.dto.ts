import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsString,
  ValidateNested,
} from 'class-validator';

/** 可同步的数据源类型 */
export const AI_DATA_SOURCES = ['articles', 'projects', 'messages', 'logs'] as const;
export type AiDataSource = (typeof AI_DATA_SOURCES)[number];

/**
 * 单数据源下的具体记录选择。
 * - articles / projects / messages：ids 为数据库数字 id 的字符串形式，如 "12"
 * - logs：ids 为 "audit:{id}" 或 "app:{id}"
 */
export class SyncItemDto {
  @IsIn(AI_DATA_SOURCES)
  source!: AiDataSource;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  ids!: string[];
}

/** 管理端向量化同步请求：仅处理 items 中显式勾选的记录 */
export class SyncDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => SyncItemDto)
  items!: SyncItemDto[];
}
