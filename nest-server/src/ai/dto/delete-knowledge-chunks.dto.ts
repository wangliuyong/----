import { ArrayMinSize, IsArray, IsString } from 'class-validator';

/** 批量删除知识库向量块 */
export class DeleteKnowledgeChunksDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  ids!: string[];
}
