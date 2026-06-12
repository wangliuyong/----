import { useCallback, useEffect, useState } from 'react';
import { Form, message } from 'antd';
import { postConvReportDelete, queryConvReportList } from '../../../../api/convenience.api';
import type { ConvReportItem, ConvReportQuery } from '../../../../types/convenience';
import {
  DEFAULT_REPORT_QUERY,
  EMPTY_REPORT_TYPE_STATS,
  type ReportTypeKey,
  type ReportTypeStats,
} from '../constants';

const REPORT_TYPES: ReportTypeKey[] = ['SPAM', 'FRAUD', 'ILLEGAL', 'OTHER'];

/**
 * 并行拉取各举报类型的 total 数量（pageSize=1 仅取 total 字段）
 */
async function queryReportTypeStats(): Promise<ReportTypeStats> {
  const [allRes, ...typeRes] = await Promise.all([
    queryConvReportList({ page: 1, pageSize: 1 }),
    ...REPORT_TYPES.map((reportType) =>
      queryConvReportList({ page: 1, pageSize: 1, reportType }),
    ),
  ]);

  return {
    total: allRes.total,
    byType: Object.fromEntries(
      REPORT_TYPES.map((key, index) => [key, typeRes[index]?.total ?? 0]),
    ) as ReportTypeStats['byType'],
  };
}

/** 举报管理页：列表、筛选、类型统计与详情弹窗状态 */
export function useReportsPage() {
  const [filterForm] = Form.useForm<ConvReportQuery>();
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [filters, setFilters] = useState<ConvReportQuery>(DEFAULT_REPORT_QUERY);
  const [data, setData] = useState<{ list: ConvReportItem[]; total: number } | null>(null);
  const [typeStats, setTypeStats] = useState<ReportTypeStats>(EMPTY_REPORT_TYPE_STATS);
  const [detail, setDetail] = useState<ConvReportItem | null>(null);

  /** 刷新类型分布统计 */
  const reloadStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      setTypeStats(await queryReportTypeStats());
    } finally {
      setStatsLoading(false);
    }
  }, []);

  /** 按当前筛选条件拉取列表 */
  const loadList = useCallback(async (query: ConvReportQuery) => {
    setLoading(true);
    try {
      const res = await queryConvReportList(query);
      setData({ list: res.list, total: res.total });
    } finally {
      setLoading(false);
    }
  }, []);

  /** 列表 + 统计一并刷新 */
  const reloadAll = useCallback(async () => {
    await Promise.all([loadList(filters), reloadStats()]);
  }, [filters, loadList, reloadStats]);

  useEffect(() => {
    void loadList(filters);
  }, [filters, loadList]);

  useEffect(() => {
    void reloadStats();
  }, [reloadStats]);

  const handleSearch = (values: ConvReportQuery) => {
    setFilters({ ...values, page: 1, pageSize: filters.pageSize ?? 10 });
  };

  const handleReset = () => {
    filterForm.resetFields();
    setFilters(DEFAULT_REPORT_QUERY);
  };

  const handleTableChange = (page: number, pageSize: number) => {
    setFilters((prev) => ({ ...prev, page, pageSize }));
  };

  const handleTypeFilter = (reportType?: ReportTypeKey) => {
    filterForm.setFieldsValue({ reportType });
    setFilters((prev) => ({
      ...prev,
      reportType,
      page: 1,
    }));
  };

  const handleDelete = useCallback(async (id: number) => {
    await postConvReportDelete(id);
    if (detail?.id === id) setDetail(null);
    message.success('已删除');
    await reloadAll();
  }, [detail?.id, reloadAll]);

  return {
    filterForm,
    loading,
    statsLoading,
    filters,
    data,
    typeStats,
    detail,
    setDetail,
    handleSearch,
    handleReset,
    handleTableChange,
    handleTypeFilter,
    handleDelete,
    reloadAll,
  };
}
