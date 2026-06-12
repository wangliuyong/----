import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';

/** 便民 API 异常统一格式：{ code, message, data: null } */
@Catch()
export class ConvApiExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    const isConvenience =
      request.path?.includes('/auth/wechat-login') ||
      request.path?.includes('/auth/phone-login') ||
      request.path?.includes('/auth/logout') ||
      request.path?.startsWith('/api/user') ||
      request.path?.startsWith('/api/banners') ||
      request.path?.startsWith('/api/categories') ||
      request.path?.startsWith('/api/notices') ||
      request.path?.startsWith('/api/city-info') ||
      request.path?.startsWith('/api/collects') ||
      request.path?.startsWith('/api/reports') ||
      request.path === '/api/ai/sessions' ||
      /^\/api\/ai\/sessions\/\d+\/messages$/.test(request.path || '') ||
      (request.path === '/api/ai/chat' && request.body?.question !== undefined) ||
      request.path?.startsWith('/api/upload');

    if (!isConvenience) {
      if (exception instanceof HttpException) {
        const status = exception.getStatus();
        const body = exception.getResponse();
        response.status(status).json(body);
        return;
      }
      response.status(500).json({ statusCode: 500, message: 'Internal server error' });
      return;
    }

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? this.extractMessage(exception)
        : '服务器内部错误';

    response.status(status).json({
      code: status,
      message,
      data: null,
    });
  }

  private extractMessage(exception: HttpException): string {
    const res = exception.getResponse();
    if (typeof res === 'string') return res;
    if (typeof res === 'object' && res !== null && 'message' in res) {
      const msg = (res as { message: string | string[] }).message;
      return Array.isArray(msg) ? msg.join('; ') : msg;
    }
    return exception.message;
  }
}
