import { SetMetadata } from '@nestjs/common';

/** 标记无需 JWT 鉴权的便民接口 */
export const CONV_PUBLIC_KEY = 'convPublic';
export const ConvPublic = () => SetMetadata(CONV_PUBLIC_KEY, true);
