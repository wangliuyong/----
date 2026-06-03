import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

/** 管理端更新 AI 配置请求体 */
export class UpdateAiConfigDto {
  /** OpenAI 兼容 API Key；留空或不传则保留原值 */
  @IsOptional()
  @IsString()
  @MaxLength(512)
  openaiApiKey?: string;

  @IsOptional()
  @IsString()
  @MaxLength(512)
  openaiBaseUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(128)
  openaiChatModel?: string;

  @IsOptional()
  @IsString()
  @MaxLength(128)
  openaiEmbeddingModel?: string;

  @IsOptional()
  @IsInt()
  @Min(64)
  @Max(4096)
  embeddingDimensions?: number;
}
