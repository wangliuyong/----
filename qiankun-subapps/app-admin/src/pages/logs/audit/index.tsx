import { EyeOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Modal, Select, Space, Table, Tag } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { useCallback, useEffect, useState } from 'react';
import {
  listAuditLogs,
  type AuditLog,
  type AuditLogQuery,
  type PaginatedResult,
} from '../../../api/logs.api';
import PageLoading from '../../../components/_common/PageLoading';

/** 操作类型中文映射 */
const ACTION_LABELS: Record<string, string> = {
  create: '新建',
  update: '编辑',
  delete: '删除',
  login: '登录',
};

/** 操作类型 Tag 颜色 */
const ACTION_COLORS: Record<string, string> = {
  create: 'green',
  update: 'blue',
  delete: 'red',
  login: 'purple',
};

/** 路由 logs/audit — 操作审计日志（只读 + 筛选 + 分页） */
export default function AuditLogsPage() {
  const [form] = Form.useForm<AuditLogQuery>();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<PaginatedResult<AuditLog> | null>(null);
  const [filters, setFilters] = useState<AuditLogQuery>({ page: 1, pageSize: 20 });
  const [detailRecord, setDetailRecord] = useState<AuditLog | null>(null);

  /** 拉取列表数据 */
  const loadData = useCallback(async (query: AuditLogQuery) => {
    setLoading(true);
    try {
      setData(await listAuditLogs(query));
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
  const handleSearch = (values: AuditLogQuery) => {
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

  const columns: ColumnsType<AuditLog> = [
    {
      title: '操作',
      dataIndex: 'action',
      width: 90,
      render: (action: string) => (
        <Tag color={ACTION_COLORS[action] ?? 'default'}>
          {ACTION_LABELS[action] ?? action}
        </Tag>
      ),
    },
    { title: '操作人', dataIndex: 'username', width: 120, render: (v) => v || '-' },
    { title: '模块', dataIndex: 'module', width: 160, ellipsis: true, render: (v) => v || '-' },
    { title: '目标 ID', dataIndex: 'targetId', width: 100, render: (v) => v || '-' },
    { title: 'IP', dataIndex: 'ip', width: 140, render: (v) => v || '-' },
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
          disabled={!record.detail}
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
      <Card title="操作审计日志">
        <Form
          form={form}
          layout="inline"
          style={{ marginBottom: 16 }}
          onFinish={handleSearch}
        >
          <Form.Item name="action" label="操作类型">
            <Select
              allowClear
              placeholder="全部"
              style={{ width: 120 }}
              options={[
                { label: '新建', value: 'create' },
                { label: '编辑', value: 'update' },
                { label: '删除', value: 'delete' },
                { label: '登录', value: 'login' },
              ]}
            />
          </Form.Item>
          <Form.Item name="username" label="操作人">
            <Input allowClear placeholder="用户名" style={{ width: 140 }} />
          </Form.Item>
          <Form.Item name="module" label="模块">
            <Input allowClear placeholder="模块路径" style={{ width: 160 }} />
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
          scroll={{ x: 900 }}
          pagination={{
            current: data?.page ?? 1,
            pageSize: data?.pageSize ?? 20,
            total: data?.total ?? 0,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
          onChange={handleTableChange}
          locale={{ emptyText: '暂无审计日志' }}
        />
      </Card>

      {/* 详情弹窗：展示请求体摘要 */}
      <Modal
        title="操作详情"
        open={Boolean(detailRecord)}
        footer={null}
        width={520}
        onCancel={() => setDetailRecord(null)}
      >
        {detailRecord && (
          <>
            <p>
              <Tag color={ACTION_COLORS[detailRecord.action] ?? 'default'}>
                {ACTION_LABELS[detailRecord.action] ?? detailRecord.action}
              </Tag>
              <span style={{ marginLeft: 8 }}>{detailRecord.username ?? '未知用户'}</span>
              <span style={{ marginLeft: 8, color: '#999' }}>
                {new Date(detailRecord.createdAt).toLocaleString()}
              </span>
            </p>
            <p><strong>模块：</strong>{detailRecord.module ?? '-'}</p>
            <p><strong>目标 ID：</strong>{detailRecord.targetId ?? '-'}</p>
            <p><strong>IP：</strong>{detailRecord.ip ?? '-'}</p>
            <pre style={{ maxHeight: 240, overflow: 'auto', background: '#f5f5f5', padding: 12, borderRadius: 6, fontSize: 12, whiteSpace: 'pre-wrap' }}>
              {detailRecord.detail ?? '无详情'}
            </pre>
          </>
        )}
      </Modal>
    </>
  );
}
