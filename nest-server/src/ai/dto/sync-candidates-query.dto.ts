import { IsIn } from 'class-validator';
import { AI_DATA_SOURCES, type AiDataSource } from './sync.dto';

/** 同步候选列表查询 */
export class SyncCandidatesQueryDto {
  @IsIn(AI_DATA_SOURCES)
  source!: AiDataSource;
}

export type { AiDataSource };
