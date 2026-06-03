import { ArrayMinSize, IsArray, IsIn } from 'class-validator';

/** 可同步的数据源类型 */
export const AI_DATA_SOURCES = ['articles', 'projects', 'messages', 'logs'] as const;
export type AiDataSource = (typeof AI_DATA_SOURCES)[number];

/** 管理端数据源同步请求体 */
export class SyncDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsIn(AI_DATA_SOURCES, { each: true })
  sources!: AiDataSource[];
}
