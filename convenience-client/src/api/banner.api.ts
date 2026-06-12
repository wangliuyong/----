import { request } from './client';
import type { BannerItem } from '@/types/city-info';
import { resolveMediaUrl } from '@/utils/media';

/** 查询首页轮播图 */
export async function queryBannerList(): Promise<BannerItem[]> {
  const list = await request<BannerItem[]>('/banners');
  return list.map((b) => ({ ...b, imageUrl: resolveMediaUrl(b.imageUrl) }));
}
