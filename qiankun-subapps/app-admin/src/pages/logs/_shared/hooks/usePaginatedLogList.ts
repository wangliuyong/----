import { Form } from 'antd';
import type { TablePaginationConfig } from 'antd/es/table';
import { useCallback, useEffect, useState } from 'react';
import type { PaginatedResult } from '../../../../api/logs.api';

export interface PaginatedQuery {
  page?: number;
  pageSize?: number;
}

const DEFAULT_QUERY: PaginatedQuery = { page: 1, pageSize: 20 };

/**
 * 日志列表页通用：分页、筛选表单、加载状态。
 */
export function usePaginatedLogList<T, Q extends PaginatedQuery>(
  fetcher: (query: Q) => Promise<PaginatedResult<T>>,
) {
  const [form] = Form.useForm<Q>();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<PaginatedResult<T> | null>(null);
  const [filters, setFilters] = useState<Q>(DEFAULT_QUERY as Q);

  const loadData = useCallback(
    async (query: Q) => {
      setLoading(true);
      try {
        setData(await fetcher(query));
      } catch {
        /* 错误已由 request 拦截器 toast */
      } finally {
        setLoading(false);
      }
    },
    [fetcher],
  );

  useEffect(() => {
    void loadData(filters);
  }, [filters, loadData]);

  const handleSearch = (values: Q) => {
    setFilters({ ...values, page: 1, pageSize: filters.pageSize ?? 20 } as Q);
  };

  const handleReset = () => {
    form.resetFields();
    setFilters(DEFAULT_QUERY as Q);
  };

  const handleRefresh = () => void loadData(filters);

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setFilters((prev) => ({
      ...prev,
      page: pagination.current ?? 1,
      pageSize: pagination.pageSize ?? 20,
    }) as Q);
  };

  return {
    form,
    loading,
    data,
    filters,
    handleSearch,
    handleReset,
    handleRefresh,
    handleTableChange,
  };
}
