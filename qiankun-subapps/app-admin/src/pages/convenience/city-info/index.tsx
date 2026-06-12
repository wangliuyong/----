import {
  AuditOutlined,
  TeamOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import {
  Button,
  Descriptions,
  Form,
  Image,
  Input,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  message,
} from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { useCallback, useEffect, useState } from 'react';
import {
  AdminPageShell,
  AdminSectionCard,
  ADMIN_TABLE_DEFAULTS,
  mergeAdminTablePagination,
} from '../../../components/admin-page';
import PageLoading from '../../../components/_common/PageLoading';
import PermissionGuard from '../../../components/PermissionGuard';
import {
  postConvCityInfoAudit,
  postConvCityInfoDelete,
  queryConvCityInfoDetail,
  queryConvCityInfoList,
} from '../../../api/convenience.api';
import type { ConvCityInfoItem, ConvCityInfoQuery } from '../../../types/convenience';

const AUDIT_STATUS_MAP = {
  PENDING: { label: '待审核', color: 'gold' },
  APPROVED: { label: '已通过', color: 'green' },
  REJECTED: { label: '已驳回', color: 'red' },
} as const;

const DEFAULT_QUERY: ConvCityInfoQuery = { page: 1, pageSize: 10, auditStatus: 'PENDING' };

/** 路由 convenience/city-info — 便民信息审核 */
export default function ConvCityInfoPage() {
  const [form] = Form.useForm<ConvCityInfoQuery>();
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ConvCityInfoQuery>(DEFAULT_QUERY);
  const [data, setData] = useState<{ list: ConvCityInfoItem[]; total: number } | null>(null);
  const [detail, setDetail] = useState<ConvCityInfoItem | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const loadData = useCallback(async (query: ConvCityInfoQuery) => {
    setLoading(true);
    try {
      const res = await queryConvCityInfoList(query);
      setData({ list: res.list, total: res.total });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData(filters);
  }, [filters, loadData]);

  const openDetail = async (id: number) => {
    setDetailOpen(true);
    setDetail(null);
    try {
      setDetail(await queryConvCityInfoDetail(id));
    } catch {
      setDetailOpen(false);
    }
  };

  const handleAudit = async (id: number, auditStatus: 'APPROVED' | 'REJECTED') => {
    await postConvCityInfoAudit(id, auditStatus);
    message.success(auditStatus === 'APPROVED' ? '已通过审核' : '已驳回');
    await loadData(filters);
    if (detail?.id === id) {
      setDetail(await queryConvCityInfoDetail(id));
    }
  };

  const handleDelete = async (id: number) => {
    await postConvCityInfoDelete(id);
    message.success('已删除');
    setDetailOpen(false);
    await loadData(filters);
  };

  const columns: ColumnsType<ConvCityInfoItem> = [
    { title: 'ID', dataIndex: 'id', width: 72 },
    { title: '标题', dataIndex: 'title', ellipsis: true },
    { title: '分类', dataIndex: 'categoryName', width: 120 },
    {
      title: '发布者',
      width: 120,
      render: (_, r) => r.userNickname || r.userPhone || r.userId,
    },
    {
      title: '状态',
      dataIndex: 'auditStatus',
      width: 96,
      render: (v: keyof typeof AUDIT_STATUS_MAP) => (
        <Tag color={AUDIT_STATUS_MAP[v]?.color}>{AUDIT_STATUS_MAP[v]?.label}</Tag>
      ),
    },
    { title: '发布时间', dataIndex: 'createdAt', width: 180 },
    {
      title: '操作',
      width: 220,
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" onClick={() => void openDetail(record.id)}>
            详情
          </Button>
          {record.auditStatus === 'PENDING' && (
            <PermissionGuard code="admin:conv:city-info:audit">
              <Button type="link" size="small" onClick={() => void handleAudit(record.id, 'APPROVED')}>
                通过
              </Button>
              <Button type="link" size="small" danger onClick={() => void handleAudit(record.id, 'REJECTED')}>
                驳回
              </Button>
            </PermissionGuard>
          )}
        </Space>
      ),
    },
  ];

  const onTableChange = (pagination: TablePaginationConfig) => {
    setFilters((prev) => ({
      ...prev,
      page: pagination.current ?? 1,
      pageSize: pagination.pageSize ?? 10,
    }));
  };

  const statusLabel = filters.auditStatus
    ? AUDIT_STATUS_MAP[filters.auditStatus as keyof typeof AUDIT_STATUS_MAP]?.label
    : '全部';

  if (loading && !data) return <PageLoading />;

  return (
    <>
      <AdminPageShell
        title="便民信息审核"
        description="审核用户发布的便民信息，支持按状态筛选与详情预览"
        stats={[
          {
            label: '匹配记录',
            value: data?.total ?? 0,
            icon: <UnorderedListOutlined />,
            accent: 'primary',
            hint: `筛选：${statusLabel}`,
          },
          {
            label: '当前筛选',
            value: statusLabel,
            icon: <AuditOutlined />,
            accent: filters.auditStatus === 'PENDING' ? 'warning' : 'default',
          },
        ]}
      >
        <AdminSectionCard noPadding>
          <Form
            form={form}
            layout="inline"
            className="admin-filter-bar"
            initialValues={DEFAULT_QUERY}
            onFinish={(values) => setFilters({ ...values, page: 1, pageSize: filters.pageSize })}
          >
          <Form.Item name="auditStatus" label="审核状态">
            <Select
              allowClear
              style={{ width: 120 }}
              options={[
                { value: 'PENDING', label: '待审核' },
                { value: 'APPROVED', label: '已通过' },
                { value: 'REJECTED', label: '已驳回' },
              ]}
            />
          </Form.Item>
          <Form.Item name="keyword" label="关键词">
            <Input placeholder="标题/内容" allowClear style={{ width: 180 }} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button
                onClick={() => {
                  form.resetFields();
                  setFilters(DEFAULT_QUERY);
                }}
              >
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>

        <Table
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={data?.list ?? []}
          size={ADMIN_TABLE_DEFAULTS.size}
          className={ADMIN_TABLE_DEFAULTS.className}
          scroll={{ x: 'max-content' }}
          pagination={mergeAdminTablePagination({
            current: filters.page,
            pageSize: filters.pageSize,
            total: data?.total ?? 0,
          })}
          onChange={onTableChange}
        />
        </AdminSectionCard>
      </AdminPageShell>

      <Modal
        title="信息详情"
        open={detailOpen}
        width={720}
        footer={null}
        onCancel={() => setDetailOpen(false)}
      >
        {detail && (
          <>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="标题">{detail.title}</Descriptions.Item>
              <Descriptions.Item label="分类">{detail.categoryName}</Descriptions.Item>
              <Descriptions.Item label="发布者">
                {detail.userNickname} {detail.userPhone ? `(${detail.userPhone})` : ''}
              </Descriptions.Item>
              <Descriptions.Item label="价格">
                {detail.price != null ? `¥${detail.price}` : '面议'}
              </Descriptions.Item>
              <Descriptions.Item label="地址">{detail.address || '-'}</Descriptions.Item>
              <Descriptions.Item label="详情">{detail.content}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={AUDIT_STATUS_MAP[detail.auditStatus]?.color}>
                  {AUDIT_STATUS_MAP[detail.auditStatus]?.label}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
            {detail.images.length > 0 && (
              <Image.PreviewGroup>
                <Space wrap style={{ marginTop: 16 }}>
                  {detail.images.map((url) => (
                    <Image key={url} src={url} width={100} height={100} style={{ objectFit: 'cover' }} />
                  ))}
                </Space>
              </Image.PreviewGroup>
            )}
            <Space style={{ marginTop: 16 }}>
              {detail.auditStatus === 'PENDING' && (
                <PermissionGuard code="admin:conv:city-info:audit">
                  <Button type="primary" onClick={() => void handleAudit(detail.id, 'APPROVED')}>
                    通过审核
                  </Button>
                  <Button danger onClick={() => void handleAudit(detail.id, 'REJECTED')}>
                    驳回
                  </Button>
                </PermissionGuard>
              )}
              <PermissionGuard code="admin:conv:city-info:delete">
                <Popconfirm title="确定删除该信息？" onConfirm={() => void handleDelete(detail.id)}>
                  <Button danger>删除</Button>
                </Popconfirm>
              </PermissionGuard>
            </Space>
          </>
        )}
      </Modal>
    </>
  );
}
