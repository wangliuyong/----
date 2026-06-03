import { EyeOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Modal, Select, Space, Table, Tag } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { useCallback, useEffect, useState } from 'react';
import {
  listAppLogs,
  type AppLog,
  type AppLogQuery,
  type PaginatedResult,
} from '../../../api/logs.api';
import PageLoading from '../../../components/_common/PageLoading';

/** 日志级别 Tag 颜色 */
const LEVEL_COLORS: Record<string, string> = {
  error: 'red',
  warn: 'orange',
  info: 'blue',
  debug: 'default',
  verbose: 'default',
};

/** 路由 logs/app — 应用运行日志（只读 + 筛选 + 分页） */
export default function AppLogsPage() {
  const [form] = Form.useForm<AppLogQuery>();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<PaginatedResult<AppLog> | null>(null);
  const [filters, setFilters] = useState<AppLogQuery>({ page: 1, pageSize: 20 });
  const [detailRecord, setDetailRecord] = useState<AppLog | null>(null);

  /** 拉取列表数据 */
  const loadData = useCallback(async (query: AppLogQuery) => {
    setLoading(true);
    try {
      setData(await listAppLogs(query));
    } catch {
      /* 错误已由 request 拦截器 toast */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData(filters);
  }, [filters, loadData]);

  /** 提交筛选表单 */
  const handleSearch = (values: AppLogQuery) => {
    setFilters({ ...values, page: 1, pageSize: filters.pageSize ?? 20 });
  };

  /** 重置筛选 */
  const handleReset = () => {
    form.resetFields();
    setFilters({ page: 1, pageSize: 20 });
  };

  /** 分页切换 */
  const handleTableChange = (pagination: TablePaginationConfig) => {
    setFilters((prev) => ({
      ...prev,
      page: pagination.current ?? 1,
      pageSize: pagination.pageSize ?? 20,
    }));
  };

  const columns: ColumnsType<AppLog> = [
    {
      title: '级别',
      dataIndex: 'level',
      width: 90,
      render: (level: string) => (
        <Tag color={LEVEL_COLORS[level] ?? 'default'}>{level.toUpperCase()}</Tag>
      ),
    },
    { title: '上下文', dataIndex: 'context', width: 140, ellipsis: true, render: (v) => v || '-' },
    { title: '消息', dataIndex: 'message', ellipsis: true },
    {
      title: '时间',
      dataIndex: 'createdAt',
      width: 170,
      render: (v: string) => new Date(v).toLocaleString(),
    },
    {
      title: '详情',
      width: 80,
      fixed: 'right',
      render: (_, record) => (
        <Button
          type="link"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => setDetailRecord(record)}
        >
          查看
        </Button>
      ),
    },
  ];

  if (loading && !data) return <PageLoading />;

  return (
    <>
      <Card title="应用运行日志">
        <Form
          form={form}
          layout="inline"
          style={{ marginBottom: 16 }}
          onFinish={handleSearch}
        >
          <Form.Item name="level" label="级别">
            <Select
              allowClear
              placeholder="全部"
              style={{ width: 120 }}
              options={[
                { label: 'ERROR', value: 'error' },
                { label: 'WARN', value: 'warn' },
                { label: 'INFO', value: 'info' },
                { label: 'DEBUG', value: 'debug' },
                { label: 'VERBOSE', value: 'verbose' },
              ]}
            />
          </Form.Item>
          <Form.Item name="keyword" label="关键词">
            <Input allowClear placeholder="搜索消息内容" style={{ width: 200 }} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                查询
              </Button>
              <Button onClick={handleReset} icon={<ReloadOutlined />}>
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>

        <Table
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={data?.items ?? []}
          scroll={{ x: 800 }}
          pagination={{
            current: data?.page ?? 1,
            pageSize: data?.pageSize ?? 20,
            total: data?.total ?? 0,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
          onChange={handleTableChange}
          locale={{ emptyText: '暂无运行日志' }}
        />
      </Card>

      {/* 详情弹窗：展示完整消息与堆栈 */}
      <Modal
        title="日志详情"
        open={Boolean(detailRecord)}
        footer={null}
        width={640}
        onCancel={() => setDetailRecord(null)}
      >
        {detailRecord && (
          <>
            <p>
              <Tag color={LEVEL_COLORS[detailRecord.level] ?? 'default'}>
                {detailRecord.level.toUpperCase()}
              </Tag>
              {detailRecord.context && (
                <Tag style={{ marginLeft: 8 }}>{detailRecord.context}</Tag>
              )}
              <span style={{ marginLeft: 8, color: '#999' }}>
                {new Date(detailRecord.createdAt).toLocaleString()}
              </span>
            </p>
            <pre style={{ background: '#f5f5f5', padding: 12, borderRadius: 6, fontSize: 13, whiteSpace: 'pre-wrap' }}>
              {detailRecord.message}
            </pre>
            {detailRecord.stack && (
              <>
                <p style={{ marginTop: 12, fontWeight: 600 }}>堆栈信息</p>
                <pre style={{ background: '#fff1f0', padding: 12, borderRadius: 6, fontSize: 12, maxHeight: 240, overflow: 'auto', whiteSpace: 'pre-wrap' }}>
                  {detailRecord.stack}
                </pre>
              </>
            )}
          </>
        )}
      </Modal>
    </>
  );
}
