import { CommentOutlined, MailOutlined } from '@ant-design/icons';
import { useMemo } from 'react';
import { AdminPageShell, AdminSectionCard } from '../../components/admin-page';
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

  const unreadHint = messages.length > 0 ? '按时间倒序展示' : undefined;

  return (
    <AdminPageShell
      title="留言管理"
      description="访客通过前台联系表单提交的留言，可在此查看与删除"
      stats={[
        {
          label: '留言总数',
          value: messages.length,
          icon: <MailOutlined />,
          accent: 'primary',
        },
        {
          label: '列表状态',
          value: messages.length > 0 ? '有数据' : '暂无',
          icon: <CommentOutlined />,
          hint: unreadHint,
        },
      ]}
    >
      <AdminSectionCard>
        <MessageTable messages={messages} columnHandlers={columnHandlers} />
      </AdminSectionCard>
    </AdminPageShell>
  );
}
