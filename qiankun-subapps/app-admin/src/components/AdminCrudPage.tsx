import { DeleteOutlined, EditOutlined, PlusOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { Form, message, type FormInstance } from 'antd';
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
import { UiButton, UiModal, UiPopconfirm, UiTable, type UiTableColumn } from './ui';

export interface AdminCrudPageProps<T extends { id: number }> {
  title: string;
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
  createPermission?: string;
  updatePermission?: string;
  deletePermission?: string;
  extraActions?: (record: T) => ReactNode;
  stats?: AdminStatItem[];
  showTotalStat?: boolean;
  toolbar?: ReactNode;
}

/** 将 Ant Design 列定义转为自定义表格列（结构兼容） */
function toUiColumns<T>(columns: ColumnsType<T>): UiTableColumn<T>[] {
  return columns.map((col, index) => ({
    title: col.title,
    dataIndex: col.dataIndex as keyof T & string | undefined,
    key: col.key as string | undefined,
    width: col.width as number | string | undefined,
    fixed: col.fixed as 'left' | 'right' | undefined,
    render: col.render as UiTableColumn<T>['render'],
  }));
}

/** 后台标准 CRUD 页壳：Hero + 统计 + 自定义 Table + Modal Form */
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
    <UiButton variant="primary" icon={<PlusOutlined />} onClick={openCreate}>
      {createLabel}
    </UiButton>
  );

  const uiColumns = toUiColumns(columns);
  const actionColumn: UiTableColumn<T> = {
    title: '操作',
    key: 'actions',
    width: extraActions ? 200 : 140,
    fixed: 'right',
    render: (_, record) => (
      <div className="ui-space" style={{ gap: 4 }}>
        {extraActions?.(record)}
        <PermissionGuard code={updatePermission ?? ''}>
          <UiButton variant="link" size="sm" icon={<EditOutlined />} onClick={() => openEdit(record)}>
            编辑
          </UiButton>
        </PermissionGuard>
        <PermissionGuard code={deletePermission ?? ''}>
          <UiPopconfirm title={deleteConfirmTitle} onConfirm={() => handleDelete(record.id)}>
            <UiButton variant="link" size="sm" icon={<DeleteOutlined />}>
              删除
            </UiButton>
          </UiPopconfirm>
        </PermissionGuard>
      </div>
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
        <UiTable
          rowKey="id"
          columns={[...uiColumns, actionColumn]}
          dataSource={data}
          className={ADMIN_TABLE_DEFAULTS.className}
          scroll={{ x: 'max-content' }}
          pagination={mergeAdminTablePagination({ total: data.length })}
        />
      </AdminSectionCard>

      <UiModal
        title={editing?.id ? modalTitles.edit : modalTitles.create}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => void handleSave()}
        confirmLoading={saving}
        width={modalWidth}
      >
        <Form form={form} layout="vertical">
          {renderForm(form)}
        </Form>
      </UiModal>
    </AdminPageShell>
  );
}
