import { Form, message } from 'antd';
import type { TablePaginationConfig } from 'antd/es/table';
import { useCallback, useEffect, useState } from 'react';
import {
  batchDeleteKnowledgeChunks,
  deleteKnowledgeChunk,
  getKnowledgeChunk,
  listKnowledgeChunks,
  type KnowledgeChunkDetail,
  type KnowledgeChunkQuery,
  type PaginatedKnowledgeChunks,
} from '../../../../api/ai.api';

const DEFAULT_QUERY: KnowledgeChunkQuery = { page: 1, pageSize: 20 };

/**
 * 知识库列表页：分页查询、筛选、单删/批删、详情加载。
 */
export function useKnowledgeChunks() {
  const [form] = Form.useForm<KnowledgeChunkQuery>();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<PaginatedKnowledgeChunks | null>(null);
  const [filters, setFilters] = useState<KnowledgeChunkQuery>(DEFAULT_QUERY);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [detail, setDetail] = useState<KnowledgeChunkDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const loadData = useCallback(async (query: KnowledgeChunkQuery) => {
    setLoading(true);
    try {
      setData(await listKnowledgeChunks(query));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData(filters);
  }, [filters, loadData]);

  const handleSearch = (values: KnowledgeChunkQuery) => {
    setFilters({ ...values, page: 1, pageSize: filters.pageSize ?? 20 });
    setSelectedRowKeys([]);
  };

  const handleReset = () => {
    form.resetFields();
    setFilters(DEFAULT_QUERY);
    setSelectedRowKeys([]);
  };

  const handleRefresh = () => void loadData(filters);

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setFilters((prev) => ({
      ...prev,
      page: pagination.current ?? 1,
      pageSize: pagination.pageSize ?? 20,
    }));
  };

  const handleDeleteOne = async (id: string) => {
    await deleteKnowledgeChunk(id);
    message.success('已删除该向量块');
    setSelectedRowKeys((keys) => keys.filter((k) => k !== id));
    await loadData(filters);
  };

  const handleBatchDelete = async () => {
    if (!selectedRowKeys.length) return;
    const res = await batchDeleteKnowledgeChunks(selectedRowKeys);
    message.success(`已删除 ${res.deleted} 条向量记录`);
    setSelectedRowKeys([]);
    await loadData(filters);
  };

  const openDetail = async (id: string) => {
    setDetailLoading(true);
    setDetail(null);
    try {
      setDetail(await getKnowledgeChunk(id));
    } finally {
      setDetailLoading(false);
    }
  };

  const closeDetail = () => {
    setDetail(null);
    setDetailLoading(false);
  };

  const handleDeleteInDetail = async (id: string) => {
    await handleDeleteOne(id);
    closeDetail();
  };

  return {
    form,
    loading,
    data,
    filters,
    selectedRowKeys,
    setSelectedRowKeys,
    detail,
    detailLoading,
    detailOpen: detail !== null || detailLoading,
    handleSearch,
    handleReset,
    handleRefresh,
    handleTableChange,
    handleDeleteOne,
    handleBatchDelete,
    openDetail,
    closeDetail,
    handleDeleteInDetail,
  };
}
