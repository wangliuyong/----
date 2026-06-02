import type { LinkItem } from '../../../../_shared/contentTypes';
import { useWebQuery } from '../../hooks/useWebQuery';
import { webApi } from '../../utils/webApi';

/** 友链列表 */
export function useLinks() {
  const { data, loading, error } = useWebQuery<LinkItem[]>(
    webApi.listLinks,
    '友链加载失败',
  );
  return { links: data ?? [], loading, error };
}
