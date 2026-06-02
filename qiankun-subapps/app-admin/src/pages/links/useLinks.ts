import { listLinks } from '../../api/links.api';
import { useAdminQuery } from '../../hooks/useAdminQuery';
import type { LinkItem } from '../../types';

/** 友链列表数据 */
export function useLinks() {
  const { data, loading, error, reload } = useAdminQuery<LinkItem[]>(listLinks);
  return { links: data ?? [], loading, error, reload };
}
