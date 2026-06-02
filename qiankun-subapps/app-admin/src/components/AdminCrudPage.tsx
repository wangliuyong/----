import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Form,
  Modal,
  Popconfirm,
  Space,
  Table,
  message,
  type FormInstance,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState, type ReactNode } from 'react';
import PageError from './_common/PageError';
import PageLoading from './_common/PageLoading';

export interface AdminCrudPageProps<T extends { id: number }> {
  title: string;
  createLabel: string;
  data: T[];
  loading: boolean;
  error: string;
  /** 表格列（不含操作列，操作列由本组件统一追加） */
  columns: ColumnsType<T>;
  deleteConfirmTitle: string;
  modalTitles: { create: string; edit: string };
  modalWidth?: number;
  /** 表单字段，接收 Ant Design Form 实例 */
  renderForm: (form: FormInstance) => ReactNode;
  onCreate: (values: Record<string, unknown>) => Promise<void>;
  onUpdate: (id: number, values: Record<string, unknown>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onReload: () => void;
}

/**
 * 后台标准 CRUD 页壳：Table + Modal Form + 新建/编辑/删除
 * articles / projects / links 等列表页共用，避免重复 Modal 状态机
 */
export default function AdminCrudPage<T extends { id: number }>({
  title,
  createLabel,
  data,
  loading,
  error,
  columns,
  deleteConfirmTitle,
  modalTitles,
  modalWidth = 560,
  renderForm,
  onCreate,
  onUpdate,
  onDelete,
  onReload,
}: AdminCrudPageProps<T>) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<T> | null>(null);
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  if (loading) return <PageLoading />;
  if (error) return <PageError message={error} />;

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

  const actionColumn: ColumnsType<T>[number] = {
    title: '操作',
    width: 140,
    render: (_, record) => (
      <Space>
        <Button type="link" size="small" icon={<EditOutlined />} onClick={() => openEdit(record)}>
          编辑
        </Button>
        <Popconfirm title={deleteConfirmTitle} onConfirm={() => handleDelete(record.id)}>
          <Button type="link" size="small" danger icon={<DeleteOutlined />}>
            删除
          </Button>
        </Popconfirm>
      </Space>
    ),
  };

  return (
    <Card
      title={title}
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          {createLabel}
        </Button>
      }
    >
      <Table
        rowKey="id"
        columns={[...columns, actionColumn]}
        dataSource={data}
        pagination={{ pageSize: 10 }}
      />

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
    </Card>
  );
}
