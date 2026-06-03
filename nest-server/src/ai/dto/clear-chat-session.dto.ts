import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

/** 清除 AI 会话记忆请求体 */
export class ClearChatSessionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  @Matches(/^[\w-]+$/, { message: 'sessionId 格式无效' })
  sessionId!: string;
}
