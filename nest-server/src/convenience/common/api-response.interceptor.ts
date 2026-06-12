import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, map } from 'rxjs';
import { CONVENIENCE_API_KEY } from './convenience-api.decorator';

/** 便民 API 统一响应包装：{ code: 0, message, data } */
@Injectable()
export class ConvApiResponseInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const isConvenience = this.reflector.getAllAndOverride<boolean>(
      CONVENIENCE_API_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!isConvenience) {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => ({
        code: 0,
        message: 'success',
        data: data ?? null,
      })),
    );
  }
}
