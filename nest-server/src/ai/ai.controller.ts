import { Body, Controller, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ChatDto } from './dto/chat.dto';
import { AiChatService } from './services/ai-chat.service';

/** 公开 AI 问答接口（SSE 流式） */
@Controller('api/ai')
export class AiController {
  constructor(private readonly chatService: AiChatService) {}

  /**
   * 流式聊天：返回 Server-Sent Events。
   * 事件类型：token | tool_start | tool_result | done | error
   */
  @Post('chat')
  async chat(@Body() dto: ChatDto, @Res() res: Response) {
    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    try {
      for await (const event of this.chatService.streamChat(dto.message)) {
        res.write(`data: ${JSON.stringify(event)}\n\n`);
        if (event.type === 'error') break;
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      res.write(`data: ${JSON.stringify({ type: 'error', message })}\n\n`);
    }

    res.end();
  }
}
