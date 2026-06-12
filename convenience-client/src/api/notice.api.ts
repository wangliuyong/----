import { request } from './client';
import type { NoticeItem } from '@/types/city-info';

/** 查询公告列表 */
export function queryNoticeList(): Promise<NoticeItem[]> {
  return request<NoticeItem[]>('/notices');
}

/** 查询公告详情 */
export function queryNoticeDetail(id: number): Promise<NoticeItem> {
  return request<NoticeItem>(`/notices/${id}`);
}
