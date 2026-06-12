import { DeleteOutlined, EditOutlined, PlusOutlined, UnorderedListOutlined } from '@ant-design/icons';
import {
  Button,
  Form,
  Modal,
  Popconfirm,
  Space,
  Table,
  message,
  type FormInstance,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemo, useState, type ReactNode } from 'react';
import {
  AdminPageShell,
  AdminSectionCard,
  ADMIN_TABLE_DEFAULTS,
  mergeAdminTablePagination,
  type AdminStatItem,
} from './admin-page';
import PageLoading from './_common/PageLoading';
import PermissionGuard from './PermissionGuard';

export interface AdminCrudPageProps<T extends { id: number }> {
  title: string;
  /** 页面功能说明 */
  description?: string;
  createLabel: string;
  data: T[];
  loading: boolean;
  columns: ColumnsType<T>;
  deleteConfirmTitle: string;
  modalTitles: { create: string; edit: string };
  modalWidth?: number;
  renderForm: (form: FormInstance) => ReactNode;
  onCreate: (values: Record<string, unknown>) => Promise<void>;
  onUpdate: (id: number, values: Record<string, unknown>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onReload: () => void;
  /** 按钮级权限码 */
  createPermission?: string;
  updatePermission?: string;
  deletePermission?: string;
  /** 操作列额外按钮 */
  extraActions?: (record: T) => ReactNode;
  /** 自定义统计指标（默认展示总记录数） */
  stats?: AdminStatItem[];
  /** 是否展示总记录数统计，默认 true */
  showTotalStat?: boolean;
  /** 表格上方工具区（筛选等） */
  toolbar?: ReactNode;
}

/** 后台标准 CRUD 页壳：Hero + 统计 + Table + Modal Form + 权限控制 */
export default function AdminCrudPage<T extends { id: number }>({
  title,
  description,
  createLabel,
  data,
  loading,
  columns,
  deleteConfirmTitle,
  modalTitles,
  modalWidth = 560,
  renderForm,
  onCreate,
  onUpdate,
  onDelete,
  onReload,
  createPermission,
  updatePermission,
  deletePermission,
  extraActions,
  stats,
  showTotalStat = true,
  toolbar,
}: AdminCrudPageProps<T>) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<T> | null>(null);
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  const pageStats = useMemo(() => {
    const items: AdminStatItem[] = stats ? [...stats] : [];
    if (showTotalStat) {
      items.unshift({
        label: '总记录数',
        value: data.length,
        icon: <UnorderedListOutlined />,
        accent: 'primary',
      });
    }
    return items;
  }, [data.length, showTotalStat, stats]);

  if (loading) return <PageLoading />;

  const openCreate = () => {
    setEditing({});
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (record: T) => {
    setEditing(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleSave = async () => {
    const values = await form.validateFields();
    setSaving(true);
    try {
      if (editing?.id) {
        await onUpdate(editing.id, values);
        message.success('已更新');
      } else {
        await onCreate(values);
        message.success('已创建');
      }
      setModalOpen(false);
      onReload();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    await onDelete(id);
    message.success('已删除');
    onReload();
  };

  const createBtn = (
    <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
      {createLabel}
    </Button>
  );

  const actionColumn: ColumnsType<T>[number] = {
    title: '操作',
    width: extraActions ? 200 : 140,
    fixed: 'right',
    render: (_, record) => (
      <Space>
        {extraActions?.(record)}
        <PermissionGuard code={updatePermission ?? ''}>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => openEdit(record)}>
            编辑
          </Button>
        </PermissionGuard>
        <PermissionGuard code={deletePermission ?? ''}>
          <Popconfirm title={deleteConfirmTitle} onConfirm={() => handleDelete(record.id)}>
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </PermissionGuard>
      </Space>
    ),
  };

  return (
    <AdminPageShell
      title={title}
      description={description}
      stats={pageStats}
      extra={
        createPermission ? (
          <PermissionGuard code={createPermission}>{createBtn}</PermissionGuard>
        ) : (
          createBtn
        )
      }
    >
      <AdminSectionCard noPadding>
        {toolbar}
        <Table
          rowKey="id"
          columns={[...columns, actionColumn]}
          dataSource={data}
          size={ADMIN_TABLE_DEFAULTS.size}
          className={ADMIN_TABLE_DEFAULTS.className}
          scroll={{ x: 'max-content' }}
          pagination={mergeAdminTablePagination({ total: data.length })}
        />
      </AdminSectionCard>

      <Modal
        title={editing?.id ? modalTitles.edit : modalTitles.create}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSave}
        confirmLoading={saving}
        width={modalWidth}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          {renderForm(form)}
        </Form>
      </Modal>
    </AdminPageShell>
  );
}
