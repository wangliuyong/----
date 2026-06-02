import { useAdminQuery } from '../../../hooks/useAdminQuery';
import { adminApi } from '../../../utils/adminApi';
import type { Message } from '../../../types';

/** 留言列表数据 */
export function useMessages() {
  const { data, loading, error, reload } = useAdminQuery<Message[]>(adminApi.listMessages);
  return { messages: data ?? [], loading, error, reload };
}
