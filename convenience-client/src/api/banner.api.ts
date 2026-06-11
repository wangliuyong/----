import { request } from './client';
import { mockBanners, mockDelay } from '@/mock/data';
import { useMock } from '@/utils/platform';
import type { BannerItem } from '@/types/city-info';

/** 查询首页轮播图 */
export async function queryBannerList(): Promise<BannerItem[]> {
  if (useMock()) {
    await mockDelay(150);
    return mockBanners.filter((b) => b.online);
  }
  return request<BannerItem[]>('/banners');
}
