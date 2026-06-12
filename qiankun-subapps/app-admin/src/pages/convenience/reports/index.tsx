import { Button, Card, Popconfirm, Table, Tag, message } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { useCallback, useEffect, useState } from 'react';
import PageLoading from '../../../components/_common/PageLoading';
import PermissionGuard from '../../../components/PermissionGuard';
import { postConvReportDelete, queryConvReportList } from '../../../api/convenience.api';
import type { ConvReportItem, ConvReportQuery } from '../../../types/convenience';

const REPORT_TYPE_LABEL: Record<string, string> = {
  SPAM: '垃圾信息',
  FRAUD: '欺诈',
  ILLEGAL: '违法',
  OTHER: '其他',
};

const DEFAULT_QUERY: ConvReportQuery = { page: 1, pageSize: 10 };

/** 路由 convenience/reports — 举报管理 */
export default function ConvReportsPage() {
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ConvReportQuery>(DEFAULT_QUERY);
  const [data, setData] = useState<{ list: ConvReportItem[]; total: number } | null>(null);

  const loadData = useCallback(async (query: ConvReportQuery) => {
    setLoading(true);
    try {
      const res = await queryConvReportList(query);
      setData({ list: res.list, total: res.total });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData(filters);
  }, [filters, loadData]);

  const handleDelete = async (id: number) => {
    await postConvReportDelete(id);
    message.success('已删除');
    await loadData(filters);
  };

  const columns: ColumnsType<ConvReportItem> = [
    { title: 'ID', dataIndex: 'id', width: 72 },
    { title: '举报人', dataIndex: 'userNickname', width: 120 },
    { title: '被举报信息', dataIndex: 'infoTitle', ellipsis: true },
    {
      title: '类型',
      dataIndex: 'reportType',
      width: 100,
      render: (v) => <Tag>{REPORT_TYPE_LABEL[v] ?? v}</Tag>,
    },
    { title: '说明', dataIndex: 'content', ellipsis: true },
    { title: '时间', dataIndex: 'createdAt', width: 180 },
    {
      title: '操作',
      width: 100,
      render: (_, record) => (
        <PermissionGuard code="admin:conv:reports:delete">
          <Popconfirm title="确定删除该举报记录？" onConfirm={() => void handleDelete(record.id)}>
            <Button type="link" size="small" danger>
              删除
            </Button>
          </Popconfirm>
        </PermissionGuard>
      ),
    },
  ];

  if (loading && !data) return <PageLoading />;

  return (
    <Card title="举报管理">
      <Table
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={data?.list ?? []}
        pagination={{
          current: filters.page,
          pageSize: filters.pageSize,
          total: data?.total ?? 0,
          showSizeChanger: true,
        }}
        onChange={(pagination: TablePaginationConfig) => {
          setFilters((prev) => ({
            ...prev,
            page: pagination.current ?? 1,
            pageSize: pagination.pageSize ?? 10,
          }));
        }}
      />
    </Card>
  );
}
