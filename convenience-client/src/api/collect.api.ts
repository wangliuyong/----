import { request } from './client';
import { mockState, mockDelay } from '@/mock/data';
import { useMock } from '@/utils/platform';
import type { PageResult } from '@/types/api-response';
import type { CollectItem } from '@/types/city-info';

/** 查询我的收藏列表 */
export async function queryCollectList(page = 1, pageSize = 10): Promise<PageResult<CollectItem>> {
  if (useMock()) {
    await mockDelay();
    const list = mockState.collectList.map((c) => ({
      ...c,
      info: mockState.cityInfoList.find((i) => i.id === c.infoId),
    }));
    const start = (page - 1) * pageSize;
    return {
      list: list.slice(start, start + pageSize),
      total: list.length,
      page,
      pageSize,
    };
  }
  return request<PageResult<CollectItem>>('/collects', { data: { page, pageSize } });
}

/** 收藏信息 */
export async function postCollect(infoId: number): Promise<void> {
  if (useMock()) {
    await mockDelay(200);
    if (mockState.collectList.some((c) => c.infoId === infoId)) {
      throw new Error('已收藏');
    }
    mockState.collectList.unshift({
      id: Date.now(),
      userId: 1,
      infoId,
      createdAt: new Date().toISOString(),
    });
    const info = mockState.cityInfoList.find((i) => i.id === infoId);
    if (info) info.collectCount += 1;
    return;
  }
  return request<void>('/collects', { method: 'POST', data: { infoId } });
}

/** 取消收藏 */
export async function postUncollect(infoId: number): Promise<void> {
  if (useMock()) {
    await mockDelay(200);
    mockState.collectList = mockState.collectList.filter((c) => c.infoId !== infoId);
    const info = mockState.cityInfoList.find((i) => i.id === infoId);
    if (info && info.collectCount > 0) info.collectCount -= 1;
    return;
  }
  return request<void>(`/collects/${infoId}`, { method: 'DELETE' });
}

/** 获取已收藏 infoId 列表（供列表页标记） */
export async function queryCollectedIds(): Promise<number[]> {
  if (useMock()) {
    await mockDelay(100);
    return mockState.collectList.map((c) => c.infoId);
  }
  return request<number[]>('/collects/ids');
}
