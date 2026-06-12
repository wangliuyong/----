import { request } from './client';
import type { NoticeItem } from '@/types/city-info';

/** 查询公告列表（公开接口） */
export function queryNoticeList(): Promise<NoticeItem[]> {
  return request<NoticeItem[]>('/notices', { auth: false });
}

/** 查询公告详情（公开接口） */
export function queryNoticeDetail(id: number): Promise<NoticeItem> {
  return request<NoticeItem>(`/notices/${id}`, { auth: false });
}
