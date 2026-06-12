import { SetMetadata } from '@nestjs/common';

/** 标记便民 C 端 API，启用统一 { code, message, data } 响应格式 */
export const CONVENIENCE_API_KEY = 'convenienceApi';
export const ConvenienceApi = () => SetMetadata(CONVENIENCE_API_KEY, true);
