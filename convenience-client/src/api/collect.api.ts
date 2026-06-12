import { request } from './client';
import { isLoggedIn } from '@/utils/auth';
import type { PageResult } from '@/types/api-response';
import type { CollectItem } from '@/types/city-info';
import { resolveMediaUrls } from '@/utils/media';

/** 解析收藏项中的图片 URL */
function normalizeCollectItem(item: CollectItem): CollectItem {
  if (!item.info) return item;
  return {
    ...item,
    info: { ...item.info, images: resolveMediaUrls(item.info.images) },
  };
}

/** 查询我的收藏列表 */
export async function queryCollectList(page = 1, pageSize = 10): Promise<PageResult<CollectItem>> {
  const res = await request<PageResult<CollectItem>>('/collects', { data: { page, pageSize } });
  return { ...res, list: res.list.map(normalizeCollectItem) };
}

/** 收藏信息 */
export function postCollect(infoId: number): Promise<void> {
  return request<void>('/collects', { method: 'POST', data: { infoId } });
}

/** 取消收藏 */
export function postUncollect(infoId: number): Promise<void> {
  return request<void>(`/collects/${infoId}`, { method: 'DELETE' });
}

/**
 * 获取已收藏 infoId 列表（供列表页标记）
 * 未登录时直接返回空数组，避免 401 触发跳转登录打断首页数据加载
 */
export function queryCollectedIds(): Promise<number[]> {
  if (!isLoggedIn()) return Promise.resolve([]);
  return request<number[]>('/collects/ids', {
    skipErrorMessage: true,
    skipAuthRedirect: true,
  }).catch(() => []);
}
