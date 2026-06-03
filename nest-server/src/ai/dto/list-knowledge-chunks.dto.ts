import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

const KNOWLEDGE_SOURCES = ['articles', 'projects', 'messages', 'logs'] as const;

/** 知识库向量块分页查询 */
export class ListKnowledgeChunksDto {
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

  /** 数据源：articles | projects | messages | logs */
  @IsOptional()
  @IsString()
  @IsIn(KNOWLEDGE_SOURCES)
  source?: (typeof KNOWLEDGE_SOURCES)[number];

  /** 标题 / 正文 / sourceId / slug 关键词 */
  @IsOptional()
  @IsString()
  keyword?: string;
}
