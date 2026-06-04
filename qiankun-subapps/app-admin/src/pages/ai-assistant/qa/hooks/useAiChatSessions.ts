import { Form, message } from 'antd';
import type { TablePaginationConfig } from 'antd/es/table';
import { useCallback, useEffect, useState } from 'react';
import {
  batchDeleteAiChatSessions,
  deleteAiChatSession,
  getAiChatSession,
  listAiChatSessions,
  type AiChatSessionDetail,
  type AiChatSessionQuery,
  type PaginatedAiChatSessions,
} from '../../../../api/ai.api';

const DEFAULT_QUERY: AiChatSessionQuery = { page: 1, pageSize: 20 };

/**
 * 用户问答管理页：分页查询、筛选、单删/批删、会话详情。
 */
export function useAiChatSessions() {
  const [form] = Form.useForm<AiChatSessionQuery>();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<PaginatedAiChatSessions | null>(null);
  const [filters, setFilters] = useState<AiChatSessionQuery>(DEFAULT_QUERY);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [detail, setDetail] = useState<AiChatSessionDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const loadData = useCallback(async (query: AiChatSessionQuery) => {
    setLoading(true);
    try {
      setData(await listAiChatSessions(query));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData(filters);
  }, [filters, loadData]);

  const handleSearch = (values: AiChatSessionQuery) => {
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
    await deleteAiChatSession(id);
    message.success('已删除该会话');
    setSelectedRowKeys((keys) => keys.filter((k) => k !== id));
    await loadData(filters);
  };

  const handleBatchDelete = async () => {
    if (!selectedRowKeys.length) return;
    const res = await batchDeleteAiChatSessions(selectedRowKeys);
    message.success(`已删除 ${res.deleted} 条会话`);
    setSelectedRowKeys([]);
    await loadData(filters);
  };

  const openDetail = async (id: string) => {
    setDetailLoading(true);
    setDetail(null);
    try {
      setDetail(await getAiChatSession(id));
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
