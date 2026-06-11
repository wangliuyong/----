import { request } from './client';
import { mockDelay, mockNotices } from '@/mock/data';
import { useMock } from '@/utils/platform';
import type { NoticeItem } from '@/types/city-info';

/** 查询公告列表 */
export async function queryNoticeList(): Promise<NoticeItem[]> {
  if (useMock()) {
    await mockDelay(150);
    return mockNotices.filter((n) => n.published);
  }
  return request<NoticeItem[]>('/notices');
}

/** 查询公告详情 */
export async function queryNoticeDetail(id: number): Promise<NoticeItem> {
  if (useMock()) {
    await mockDelay(150);
    const item = mockNotices.find((n) => n.id === id);
    if (!item) throw new Error('公告不存在');
    return { ...item };
  }
  return request<NoticeItem>(`/notices/${id}`);
}
