import { request } from '../../api/client';
import type { DashboardOverview } from './types';

/** 拉取首页概览聚合数据 */
export function fetchDashboardOverview(): Promise<DashboardOverview> {
  return request<DashboardOverview>('/admin/dashboard/overview');
}
