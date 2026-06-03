import { DeleteOutlined, EyeOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { useCallback, useEffect, useState } from 'react';
import {
  AI_SOURCE_OPTIONS,
  batchDeleteKnowledgeChunks,
  deleteKnowledgeChunk,
  getKnowledgeChunk,
  listKnowledgeChunks,
  type KnowledgeChunkDetail,
  type KnowledgeChunkItem,
  type KnowledgeChunkQuery,
  type PaginatedKnowledgeChunks,
} from '../../../api/ai.api';
import PageLoading from '../../../components/_common/PageLoading';
import PermissionGuard from '../../../components/PermissionGuard';
import { useAuth } from '../../../context/AuthContext';

const SOURCE_LABEL: Record<string, string> = Object.fromEntries(
  AI_SOURCE_OPTIONS.map((o) => [o.value, o.label]),
);

/** 路由 ai-assistant/knowledge — 知识库向量块查看与删除 */
export default function AiKnowledgePage() {
  const { hasPermission } = useAuth();
  const canDelete = hasPermission('admin:ai-knowledge:delete');
  const [form] = Form.useForm<KnowledgeChunkQuery>();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<PaginatedKnowledgeChunks | null>(null);
  const [filters, setFilters] = useState<KnowledgeChunkQuery>({ page: 1, pageSize: 20 });
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
    setFilters({ page: 1, pageSize: 20 });
    setSelectedRowKeys([]);
  };

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

  const columns: ColumnsType<KnowledgeChunkItem> = [
    {
      title: '数据源',
      dataIndex: 'source',
      width: 100,
      render: (s: string) => (
        <Tag>{SOURCE_LABEL[s] ?? s}</Tag>
      ),
    },
    {
      title: '标题',
      dataIndex: 'title',
      width: 160,
      ellipsis: true,
      render: (v: string) => v || '-',
    },
    {
      title: '来源 ID',
      dataIndex: 'sourceId',
      width: 90,
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      width: 120,
      ellipsis: true,
      render: (v: string) => v || '-',
    },
    {
      title: '文本预览',
      dataIndex: 'textPreview',
      ellipsis: true,
    },
    {
      title: '字数',
      dataIndex: 'textLength',
      width: 72,
      render: (n: number) => `${n}`,
    },
    {
      title: '操作',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => void openDetail(record.id)}
          >
            查看
          </Button>
          <PermissionGuard code="admin:ai-knowledge:delete">
            <Popconfirm
              title="确定删除该向量块？删除后需重新同步数据源才能恢复检索。"
              onConfirm={() => void handleDeleteOne(record.id)}
            >
              <Button type="link" size="small" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </PermissionGuard>
        </Space>
      ),
    },
  ];

  if (loading && !data) return <PageLoading />;

  return (
    <>
      <Card
        title="知识库管理"
        extra={
          <Typography.Text type="secondary">
            数据存储于 LanceDB 向量库，以下为已向量化分块
          </Typography.Text>
        }
      >
        <Form
          form={form}
          layout="inline"
          style={{ marginBottom: 16 }}
          onFinish={handleSearch}
        >
          <Form.Item name="source" label="数据源">
            <Select
              allowClear
              placeholder="全部"
              style={{ width: 140 }}
              options={AI_SOURCE_OPTIONS}
            />
          </Form.Item>
          <Form.Item name="keyword" label="关键词">
            <Input allowClear placeholder="标题 / 正文 / ID" style={{ width: 200 }} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                查询
              </Button>
              <Button onClick={handleReset}>重置</Button>
              <Button icon={<ReloadOutlined />} onClick={() => void loadData(filters)}>
                刷新
              </Button>
            </Space>
          </Form.Item>
        </Form>

        <PermissionGuard code="admin:ai-knowledge:delete">
          {selectedRowKeys.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <Popconfirm
                title={`确定删除选中的 ${selectedRowKeys.length} 条向量块？`}
                onConfirm={() => void handleBatchDelete()}
              >
                <Button danger icon={<DeleteOutlined />}>
                  批量删除（{selectedRowKeys.length}）
                </Button>
              </Popconfirm>
            </div>
          )}
        </PermissionGuard>

        <Table
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={data?.items ?? []}
          scroll={{ x: 960 }}
          rowSelection={
            canDelete
              ? {
                  selectedRowKeys,
                  onChange: (keys) => setSelectedRowKeys(keys as string[]),
                }
              : undefined
          }
          pagination={{
            current: data?.page ?? 1,
            pageSize: data?.pageSize ?? 20,
            total: data?.total ?? 0,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
          onChange={handleTableChange}
          locale={{ emptyText: '暂无向量数据，请先在「数据配置管理」中同步数据源' }}
        />
      </Card>

      <Modal
        title={detail?.title || '向量块详情'}
        open={detail !== null || detailLoading}
        onCancel={() => {
          setDetail(null);
          setDetailLoading(false);
        }}
        footer={null}
        width={720}
        destroyOnClose
      >
        {detailLoading && <PageLoading />}
        {detail && !detailLoading && (
          <div>
            <p>
              <Tag>{SOURCE_LABEL[detail.source] ?? detail.source}</Tag>
              <Typography.Text type="secondary" style={{ marginLeft: 8 }}>
                来源 ID：{detail.sourceId}
                {detail.slug ? ` · slug：${detail.slug}` : ''}
              </Typography.Text>
            </p>
            <Typography.Paragraph
              style={{
                maxHeight: 400,
                overflow: 'auto',
                whiteSpace: 'pre-wrap',
                background: 'var(--ant-color-fill-quaternary, #f5f5f5)',
                padding: 12,
                borderRadius: 8,
              }}
            >
              {detail.text}
            </Typography.Paragraph>
            <PermissionGuard code="admin:ai-knowledge:delete">
              <Popconfirm
                title="确定删除该向量块？"
                onConfirm={async () => {
                  await handleDeleteOne(detail.id);
                  setDetail(null);
                }}
              >
                <Button danger icon={<DeleteOutlined />}>
                  删除本条
                </Button>
              </Popconfirm>
            </PermissionGuard>
          </div>
        )}
      </Modal>
    </>
  );
}
