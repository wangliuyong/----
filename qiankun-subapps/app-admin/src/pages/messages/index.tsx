import { MessagesPanel } from '../../components/AdminPanels';
import PageError from '../../components/PageError';
import { useMessages } from '../../hooks/useMessages';
import PageLoading from '../_common/PageLoading';
import { useApiBase } from '../../context/ApiBaseContext';

/** 路由 /messages — 留言列表 */
export default function MessagesPage() {
  const apiBase = useApiBase();
  const { messages, loading, error, reload } = useMessages();

  if (loading) return <PageLoading />;

  return (
    <>
      <PageError message={error} />
      <MessagesPanel apiBase={apiBase} messages={messages} onRefresh={reload} />
    </>
  );
}
