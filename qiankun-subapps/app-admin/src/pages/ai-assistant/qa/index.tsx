import { useMemo } from 'react';
import PageLoading from '../../../components/_common/PageLoading';
import { useAuth } from '../../../context/AuthContext';
import QaBatchDeleteBar from './components/QaBatchDeleteBar';
import QaFilterForm from './components/QaFilterForm';
import QaPageCard from './components/QaPageCard';
import QaSessionDetailModal from './components/QaSessionDetailModal';
import QaSessionTable from './components/QaSessionTable';
import { useAiChatSessions } from './hooks/useAiChatSessions';

/** 路由 ai-assistant/qa — 用户问答管理（前台 AI 小助手对话记录） */
export default function AiQaPage() {
  const { hasPermission } = useAuth();
  const canDelete = hasPermission('admin:ai-qa:delete');

  const {
    form,
    loading,
    data,
    selectedRowKeys,
    setSelectedRowKeys,
    detail,
    detailLoading,
    detailOpen,
    handleSearch,
    handleReset,
    handleRefresh,
    handleTableChange,
    handleDeleteOne,
    handleBatchDelete,
    openDetail,
    closeDetail,
    handleDeleteInDetail,
  } = useAiChatSessions();

  const columnHandlers = useMemo(
    () => ({
      onView: (id: string) => void openDetail(id),
      onDelete: (id: string) => void handleDeleteOne(id),
    }),
    [openDetail, handleDeleteOne],
  );

  if (loading && !data) return <PageLoading />;

  return (
    <>
      <QaPageCard total={data?.total}>
        <QaFilterForm
          form={form}
          onSearch={handleSearch}
          onReset={handleReset}
          onRefresh={handleRefresh}
        />
        <QaBatchDeleteBar
          selectedCount={selectedRowKeys.length}
          onConfirm={() => void handleBatchDelete()}
        />
        <QaSessionTable
          loading={loading}
          data={data}
          canDelete={canDelete}
          selectedRowKeys={selectedRowKeys}
          onSelectionChange={setSelectedRowKeys}
          onTableChange={handleTableChange}
          columnHandlers={columnHandlers}
        />
      </QaPageCard>

      <QaSessionDetailModal
        open={detailOpen}
        loading={detailLoading}
        detail={detail}
        onClose={closeDetail}
        onDelete={(id) => void handleDeleteInDetail(id)}
      />
    </>
  );
}
