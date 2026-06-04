import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

/** 批量删除用户问答会话 */
export class DeleteChatSessionsDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  ids!: string[];
}
