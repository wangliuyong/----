import { IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from 'class-validator';

/** 公开 AI 聊天请求体 */
export class ChatDto {
  @IsString()
  @IsNotEmpty()
  message!: string;

  /** 会话 ID（LangGraph thread_id），同 ID 下自动带上历史消息记忆 */
  @IsOptional()
  @IsString()
  @MaxLength(128)
  @Matches(/^[\w-]+$/, { message: 'sessionId 格式无效' })
  sessionId?: string;
}
