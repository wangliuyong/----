import { request } from './client';
import type { PageResult } from '@/types/api-response';
import type { CityInfoItem, CityInfoPayload, CityInfoQuery } from '@/types/city-info';
import { calcDistanceKm } from '@/utils/format';
import { resolveMediaUrl, resolveMediaUrls } from '@/utils/media';

/** 为列表项附加距离、收藏标记等前端字段 */
function enrichList(
  list: CityInfoItem[],
  lat?: number,
  lng?: number,
  collectedIds: number[] = [],
): CityInfoItem[] {
  return list.map((item) => {
    const next = { ...item, images: resolveMediaUrls(item.images) };
    if (lat !== undefined && lng !== undefined && item.latitude && item.longitude) {
      next.distanceKm = calcDistanceKm(lat, lng, item.latitude, item.longitude);
    }
    if (collectedIds.length) {
      next.collected = collectedIds.includes(item.id);
    }
    return next;
  });
}

/** 分页查询便民信息 */
export async function queryCityInfoList(
  query: CityInfoQuery,
  options?: { lat?: number; lng?: number; collectedIds?: number[] },
): Promise<PageResult<CityInfoItem>> {
  const res = await request<PageResult<CityInfoItem>>('/city-info', { data: query });
  let list = enrichList(res.list, options?.lat, options?.lng, options?.collectedIds ?? []);

  if (query.sortBy === 'distance') {
    list = [...list].sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999));
  }

  return { ...res, list };
}

/** 查询便民信息详情 */
export async function queryCityInfoDetail(id: number): Promise<CityInfoItem> {
  const item = await request<CityInfoItem>(`/city-info/${id}`);
  return { ...item, images: resolveMediaUrls(item.images) };
}

/** 查询我发布的便民信息（含待审核） */
export function queryMyCityInfoList(page = 1, pageSize = 10): Promise<PageResult<CityInfoItem>> {
  return request<PageResult<CityInfoItem>>('/city-info/mine', { data: { page, pageSize } });
}

/** 发布便民信息 */
export function postCityInfo(payload: CityInfoPayload): Promise<CityInfoItem> {
  return request<CityInfoItem>('/city-info', { method: 'POST', data: payload });
}

/** 删除便民信息 */
export function postDeleteCityInfo(id: number): Promise<void> {
  return request<void>(`/city-info/${id}`, { method: 'DELETE' });
}
