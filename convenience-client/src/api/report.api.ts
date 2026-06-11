import { request } from './client';
import { mockState, mockDelay } from '@/mock/data';
import { useMock } from '@/utils/platform';
import type { ReportPayload } from '@/types/city-info';

/** 提交举报 */
export async function postReport(payload: ReportPayload): Promise<{ id: number }> {
  if (useMock()) {
    await mockDelay(300);
    mockState.reportId += 1;
    return { id: mockState.reportId };
  }
  return request<{ id: number }>('/reports', { method: 'POST', data: payload });
}
