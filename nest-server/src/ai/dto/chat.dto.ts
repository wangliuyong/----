import { IsArray, IsNotEmpty, IsOptional, IsString, ArrayMinSize } from 'class-validator';

/** 公开 AI 聊天请求体 */
export class ChatDto {
  @IsString()
  @IsNotEmpty()
  message!: string;

  /** 可选会话 ID，用于多轮上下文（后续扩展） */
  @IsOptional()
  @IsString()
  sessionId?: string;
}
