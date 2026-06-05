import { useCallback } from 'react';
import { useAdminQuery } from '../../../hooks/useAdminQuery';
import { fetchDashboardOverview } from '../api';
import type { DashboardOverview } from '../types';

/** 首页概览数据拉取与刷新 */
export function useDashboardOverview() {
  const fetcher = useCallback(() => fetchDashboardOverview(), []);
  const { data, loading, reload } = useAdminQuery<DashboardOverview>(fetcher);

  return {
    overview: data,
    loading,
    reload,
  };
}
