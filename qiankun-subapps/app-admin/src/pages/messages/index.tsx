import { Card } from 'antd';
import { useMemo } from 'react';
import PageLoading from '../../components/_common/PageLoading';
import MessageTable from './components/MessageTable';
import { useMessagesPage } from './hooks/useMessagesPage';

/** 路由 messages — 留言列表 */
export default function MessagesPage() {
  const { messages, loading, handleDelete } = useMessagesPage();

  const columnHandlers = useMemo(
    () => ({ onDelete: (id: number) => void handleDelete(id) }),
    [handleDelete],
  );

  if (loading) return <PageLoading />;

  return (
    <Card title="留言管理">
      <MessageTable messages={messages} columnHandlers={columnHandlers} />
    </Card>
  );
}
