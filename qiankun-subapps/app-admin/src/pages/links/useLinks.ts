import { useAdminQuery } from '../../hooks/useAdminQuery';
import { adminApi } from '../../utils/adminApi';
import type { LinkItem } from '../../types';

/** 友链列表数据 */
export function useLinks() {
  const { data, loading, error, reload } = useAdminQuery<LinkItem[]>(adminApi.listLinks);
  return { links: data ?? [], loading, error, reload };
}
