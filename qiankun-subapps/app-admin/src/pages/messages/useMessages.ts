import { listMessages } from '../../api/messages.api';
import { useAdminQuery } from '../../hooks/useAdminQuery';
import type { Message } from '../../types';

/** 留言列表数据 */
export function useMessages() {
  const { data, loading, error, reload } = useAdminQuery<Message[]>(listMessages);
  return { messages: data ?? [], loading, error, reload };
}
