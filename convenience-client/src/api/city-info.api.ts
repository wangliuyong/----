import { request } from './client';
import {
  mockCategories,
  mockState,
  mockDelay,
} from '@/mock/data';
import { useMock } from '@/utils/platform';
import type { PageResult } from '@/types/api-response';
import type { CityInfoItem, CityInfoPayload, CityInfoQuery } from '@/types/city-info';
import { calcDistanceKm } from '@/utils/format';

/** 根据 categoryId 查找分类名称 */
function findCategoryName(categoryId: number): string {
  for (const root of mockCategories) {
    if (root.id === categoryId) return root.name;
    for (const child of root.children || []) {
      if (child.id === categoryId) return child.name;
    }
  }
  return '其他';
}

/** 为列表项附加距离等前端字段 */
function enrichList(
  list: CityInfoItem[],
  lat?: number,
  lng?: number,
  collectedIds: number[] = [],
): CityInfoItem[] {
  return list.map((item) => {
    const next = { ...item };
    if (lat !== undefined && lng !== undefined && item.latitude && item.longitude) {
      next.distanceKm = calcDistanceKm(lat, lng, item.latitude, item.longitude);
    }
    next.collected = collectedIds.includes(item.id);
    return next;
  });
}

/** 分页查询便民信息 */
export async function queryCityInfoList(
  query: CityInfoQuery,
  options?: { lat?: number; lng?: number; collectedIds?: number[] },
): Promise<PageResult<CityInfoItem>> {
  if (useMock()) {
    await mockDelay();
    const page = query.page || 1;
    const pageSize = query.pageSize || 10;
    let list = mockState.cityInfoList.filter((item) => item.auditStatus === 'APPROVED');

    if (query.categoryId) {
      list = list.filter(
        (item) =>
          item.categoryId === query.categoryId ||
          mockCategories.some(
            (c) =>
              c.id === query.categoryId &&
              c.children?.some((ch) => ch.id === item.categoryId),
          ),
      );
    }
    if (query.keyword) {
      const kw = query.keyword.trim();
      list = list.filter(
        (item) => item.title.includes(kw) || item.content.includes(kw),
      );
    }
    if (query.sortBy === 'price') {
      list = [...list].sort((a, b) => (a.price || 0) - (b.price || 0));
    } else {
      list = [...list].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    }

    list = enrichList(list, options?.lat, options?.lng, options?.collectedIds);
    if (query.sortBy === 'distance') {
      list.sort((a, b) => (a.distanceKm || 999) - (b.distanceKm || 999));
    }

    const start = (page - 1) * pageSize;
    return {
      list: list.slice(start, start + pageSize),
      total: list.length,
      page,
      pageSize,
    };
  }

  return request<PageResult<CityInfoItem>>('/city-info', { data: query });
}

/** 查询便民信息详情 */
export async function queryCityInfoDetail(id: number): Promise<CityInfoItem> {
  if (useMock()) {
    await mockDelay(200);
    const item = mockState.cityInfoList.find((i) => i.id === id);
    if (!item) throw new Error('信息不存在');
    item.viewCount += 1;
    return { ...item };
  }
  return request<CityInfoItem>(`/city-info/${id}`);
}

/** 查询我发布的便民信息（含待审核） */
export async function queryMyCityInfoList(page = 1, pageSize = 10): Promise<PageResult<CityInfoItem>> {
  if (useMock()) {
    await mockDelay(200);
    const userId = 1;
    const list = [...mockState.cityInfoList]
      .filter((item) => item.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map((item) => ({
        ...item,
        categoryName: item.categoryName || findCategoryName(item.categoryId),
      }));
    const start = (page - 1) * pageSize;
    return {
      list: list.slice(start, start + pageSize),
      total: list.length,
      page,
      pageSize,
    };
  }
  return request<PageResult<CityInfoItem>>('/city-info/mine', { data: { page, pageSize } });
}

/** 发布便民信息 */
export async function postCityInfo(payload: CityInfoPayload): Promise<CityInfoItem> {
  if (useMock()) {
    await mockDelay(400);
    mockState.cityInfoId += 1;
    const item: CityInfoItem = {
      id: mockState.cityInfoId,
      userId: 1,
      categoryId: payload.categoryId,
      categoryName: findCategoryName(payload.categoryId),
      title: payload.title,
      content: payload.content,
      price: payload.price,
      address: payload.address,
      latitude: payload.latitude,
      longitude: payload.longitude,
      images: payload.images || [],
      auditStatus: 'PENDING',
      viewCount: 0,
      collectCount: 0,
      createdAt: new Date().toISOString(),
    };
    mockState.cityInfoList.unshift(item);
    return item;
  }
  return request<CityInfoItem>('/city-info', { method: 'POST', data: payload });
}

/** 删除便民信息 */
export async function postDeleteCityInfo(id: number): Promise<void> {
  if (useMock()) {
    await mockDelay(200);
    mockState.cityInfoList = mockState.cityInfoList.filter((i) => i.id !== id);
    return;
  }
  return request<void>(`/city-info/${id}`, { method: 'DELETE' });
}
