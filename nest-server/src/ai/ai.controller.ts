import { Body, Controller, Delete, Post, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConvAiService } from '../convenience/ai/conv-ai.service';
import { ConvAiChatDto } from '../convenience/ai/dto/conv-ai.dto';
import { ChatDto } from './dto/chat.dto';
import { ClearChatSessionDto } from './dto/clear-chat-session.dto';
import { AiChatService } from './services/ai-chat.service';

/** 公开 AI 问答接口（SSE 流式 + 会话记忆；兼容便民 C 端 JSON 问答） */
@Controller('api/ai')
export class AiController {
  constructor(
    private readonly chatService: AiChatService,
    private readonly convAiService: ConvAiService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * 流式聊天（博客 SSE）或便民 JSON 问答。
   * - 请求体含 question 字段 → 便民 C 端非流式接口
   * - 请求体含 message 字段 → 博客 SSE 流式接口
   */
  @Post('chat')
  async chat(
    @Body() body: ChatDto & ConvAiChatDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    if (body?.question !== undefined && body?.message === undefined) {
      const user = await this.extractConvUser(req);
      if (!user) {
        res.status(401).json({ code: 401, message: '未登录', data: null });
        return;
      }
      const result = await this.convAiService.chat(user.userId, {
        sessionId: body.sessionId,
        question: body.question,
      });
      res.json({ code: 0, message: 'success', data: result });
      return;
    }

    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    try {
      for await (const event of this.chatService.streamChat(body.message, body.sessionId)) {
        res.write(`data: ${JSON.stringify(event)}\n\n`);
        if (event.type === 'error') break;
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      res.write(`data: ${JSON.stringify({ type: 'error', message })}\n\n`);
    }

    res.end();
  }

  /** 从 Bearer Token 解析 C 端用户 */
  private async extractConvUser(req: Request): Promise<{ userId: number } | null> {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) return null;
    try {
      const payload = await this.jwtService.verifyAsync<{ sub: number; type: string }>(
        auth.slice(7),
      );
      if (payload.type !== 'conv') return null;
      return { userId: payload.sub };
    } catch {
      return null;
    }
  }

  /** 清空指定会话的服务端记忆（与前端「清空」配合） */
  @Delete('chat/session')
  async clearSession(@Body() dto: ClearChatSessionDto) {
    await this.chatService.clearSession(dto.sessionId);
    return { ok: true };
  }
}
