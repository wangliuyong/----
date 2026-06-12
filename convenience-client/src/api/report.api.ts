import { request } from './client';
import type { ReportPayload } from '@/types/city-info';

/** 提交举报 */
export function postReport(payload: ReportPayload): Promise<{ id: number }> {
  return request<{ id: number }>('/reports', { method: 'POST', data: payload });
}
