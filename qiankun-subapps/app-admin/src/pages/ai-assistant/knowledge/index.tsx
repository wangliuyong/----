import { useMemo } from 'react';
import PageLoading from '../../../components/_common/PageLoading';
import { useAuth } from '../../../context/AuthContext';
import KnowledgeBatchDeleteBar from './components/KnowledgeBatchDeleteBar';
import KnowledgeChunkDetailModal from './components/KnowledgeChunkDetailModal';
import KnowledgeChunkTable from './components/KnowledgeChunkTable';
import KnowledgeFilterForm from './components/KnowledgeFilterForm';
import KnowledgePageCard from './components/KnowledgePageCard';
import { useKnowledgeChunks } from './hooks/useKnowledgeChunks';

/** 路由 ai-assistant/knowledge — 知识库向量块查看与删除 */
export default function AiKnowledgePage() {
  const { hasPermission } = useAuth();
  const canDelete = hasPermission('admin:ai-knowledge:delete');

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
  } = useKnowledgeChunks();

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
      <KnowledgePageCard>
        <KnowledgeFilterForm
          form={form}
          onSearch={handleSearch}
          onReset={handleReset}
          onRefresh={handleRefresh}
        />
        <KnowledgeBatchDeleteBar
          selectedCount={selectedRowKeys.length}
          onConfirm={() => void handleBatchDelete()}
        />
        <KnowledgeChunkTable
          loading={loading}
          data={data}
          canDelete={canDelete}
          selectedRowKeys={selectedRowKeys}
          onSelectionChange={setSelectedRowKeys}
          onTableChange={handleTableChange}
          columnHandlers={columnHandlers}
        />
      </KnowledgePageCard>

      <KnowledgeChunkDetailModal
        open={detailOpen}
        loading={detailLoading}
        detail={detail}
        onClose={closeDetail}
        onDelete={(id) => void handleDeleteInDetail(id)}
      />
    </>
  );
}
