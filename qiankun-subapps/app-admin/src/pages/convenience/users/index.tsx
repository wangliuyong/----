import { TeamOutlined, UserOutlined } from '@ant-design/icons';
import {
  Button,
  Form,
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
  postConvUserResetPassword,
  postConvUserUpdate,
  queryConvUserList,
} from '../../../api/convenience.api';
import type { ConvUserItem, ConvUserQuery } from '../../../types/convenience';

const DEFAULT_QUERY: ConvUserQuery = { page: 1, pageSize: 10 };

/** 路由 convenience/users — C 端用户管理 */
export default function ConvUsersPage() {
  const [filterForm] = Form.useForm<ConvUserQuery>();
  const [editForm] = Form.useForm<ConvUserItem>();
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ConvUserQuery>(DEFAULT_QUERY);
  const [data, setData] = useState<{ list: ConvUserItem[]; total: number } | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [pwdOpen, setPwdOpen] = useState(false);
  const [current, setCurrent] = useState<ConvUserItem | null>(null);
  const [pwd, setPwd] = useState('');

  const loadData = useCallback(async (query: ConvUserQuery) => {
    setLoading(true);
    try {
      const res = await queryConvUserList(query);
      setData({ list: res.list, total: res.total });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData(filters);
  }, [filters, loadData]);

  const openEdit = (record: ConvUserItem) => {
    setCurrent(record);
    editForm.setFieldsValue(record);
    setEditOpen(true);
  };

  const openResetPwd = (record: ConvUserItem) => {
    setCurrent(record);
    setPwd('');
    setPwdOpen(true);
  };

  const handleSave = async () => {
    if (!current) return;
    const values = await editForm.validateFields();
    await postConvUserUpdate(current.id, values);
    message.success('已更新');
    setEditOpen(false);
    await loadData(filters);
  };

  const handleResetPwd = async () => {
    if (!current || !pwd.trim()) {
      message.warning('请输入新密码');
      return;
    }
    await postConvUserResetPassword(current.id, pwd);
    message.success('密码已重置');
    setPwdOpen(false);
  };

  const columns: ColumnsType<ConvUserItem> = [
    { title: 'ID', dataIndex: 'id', width: 72 },
    { title: '昵称', dataIndex: 'nickname' },
    { title: '手机号', dataIndex: 'phone', width: 130, render: (v) => v || '-' },
    {
      title: '类型',
      dataIndex: 'userType',
      width: 96,
      render: (v) => <Tag>{v}</Tag>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 88,
      render: (v) => (
        <Tag color={v === 'ACTIVE' ? 'green' : 'red'}>{v === 'ACTIVE' ? '正常' : '禁用'}</Tag>
      ),
    },
    { title: '发布数', dataIndex: 'publishCount', width: 80 },
    { title: '注册时间', dataIndex: 'createdAt', width: 180 },
    {
      title: '操作',
      width: 180,
      render: (_, record) => (
        <Space size="small">
          <PermissionGuard code="admin:conv:users:update">
            <Button type="link" size="small" onClick={() => openEdit(record)}>
              编辑
            </Button>
          </PermissionGuard>
          {record.phone && (
            <PermissionGuard code="admin:conv:users:reset-password">
              <Button type="link" size="small" onClick={() => openResetPwd(record)}>
                重置密码
              </Button>
            </PermissionGuard>
          )}
        </Space>
      ),
    },
  ];

  if (loading && !data) return <PageLoading />;

  const activeCount = data?.list.filter((u) => u.status === 'ACTIVE').length ?? 0;

  return (
    <>
      <AdminPageShell
        title="C 端用户管理"
        description="管理便民小程序注册用户，支持编辑资料与重置密码"
        stats={[
          {
            label: '用户总数',
            value: data?.total ?? 0,
            icon: <TeamOutlined />,
            accent: 'primary',
          },
          {
            label: '当前页正常',
            value: activeCount,
            icon: <UserOutlined />,
            accent: 'success',
            hint: `本页 ${data?.list.length ?? 0} 人`,
          },
        ]}
      >
        <AdminSectionCard noPadding>
          <Form
            form={filterForm}
            layout="inline"
            className="admin-filter-bar"
            onFinish={(values) => setFilters({ ...values, page: 1, pageSize: filters.pageSize })}
          >
          <Form.Item name="keyword" label="关键词">
            <Input placeholder="昵称/手机号" allowClear style={{ width: 160 }} />
          </Form.Item>
          <Form.Item name="userType" label="类型">
            <Select
              allowClear
              style={{ width: 120 }}
              options={[
                { value: 'USER', label: '普通用户' },
                { value: 'MERCHANT', label: '商家' },
                { value: 'ADMIN', label: '管理员' },
              ]}
            />
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select
              allowClear
              style={{ width: 100 }}
              options={[
                { value: 'ACTIVE', label: '正常' },
                { value: 'DISABLED', label: '禁用' },
              ]}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
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
          onChange={(pagination: TablePaginationConfig) => {
            setFilters((prev) => ({
              ...prev,
              page: pagination.current ?? 1,
              pageSize: pagination.pageSize ?? 10,
            }));
          }}
        />
        </AdminSectionCard>
      </AdminPageShell>

      <Modal title="编辑用户" open={editOpen} onOk={() => void handleSave()} onCancel={() => setEditOpen(false)}>
        <Form form={editForm} layout="vertical">
          <Form.Item name="nickname" label="昵称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="userType" label="用户类型" rules={[{ required: true }]}>
            <Select
              options={[
                { value: 'USER', label: '普通用户' },
                { value: 'MERCHANT', label: '商家' },
                { value: 'ADMIN', label: '管理员' },
              ]}
            />
          </Form.Item>
          <Form.Item name="status" label="状态" rules={[{ required: true }]}>
            <Select
              options={[
                { value: 'ACTIVE', label: '正常' },
                { value: 'DISABLED', label: '禁用' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={`重置密码 - ${current?.nickname ?? ''}`}
        open={pwdOpen}
        onOk={() => void handleResetPwd()}
        onCancel={() => setPwdOpen(false)}
      >
        <Input.Password
          placeholder="新密码"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
        />
      </Modal>
    </>
  );
}
