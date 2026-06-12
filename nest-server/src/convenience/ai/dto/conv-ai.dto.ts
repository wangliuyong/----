import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

/** 便民 AI 问答 */
export class ConvAiChatDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  sessionId?: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  question!: string;
}
