import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ConvenienceApi } from '../common/convenience-api.decorator';
import { CurrentConvUser } from '../common/current-user.decorator';
import { ConvJwtAuthGuard } from '../auth/conv-jwt-auth.guard';
import { ConvAiService } from './conv-ai.service';

/** 便民 AI 会话与消息（POST chat 由 AiController 分发） */
@ConvenienceApi()
@UseGuards(ConvJwtAuthGuard)
@Controller('api/ai')
export class ConvAiController {
  constructor(private readonly aiService: ConvAiService) {}

  @Get('sessions')
  sessions(@CurrentConvUser() user: { userId: number }) {
    return this.aiService.findSessions(user.userId);
  }

  @Get('sessions/:sessionId/messages')
  messages(
    @CurrentConvUser() user: { userId: number },
    @Param('sessionId', ParseIntPipe) sessionId: number,
  ) {
    return this.aiService.findMessages(user.userId, sessionId);
  }
}
