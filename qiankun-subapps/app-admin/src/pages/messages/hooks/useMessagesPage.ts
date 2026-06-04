import { message } from 'antd';
import { useCallback } from 'react';
import { deleteMessage } from '../../../api/messages.api';
import { useMessages } from '../useMessages';

/** 留言管理页：列表与删除 */
export function useMessagesPage() {
  const { messages, loading, reload } = useMessages();

  const handleDelete = useCallback(
    async (id: number) => {
      await deleteMessage(id);
      message.success('已删除');
      reload();
    },
    [reload],
  );

  return { messages, loading, handleDelete };
}
