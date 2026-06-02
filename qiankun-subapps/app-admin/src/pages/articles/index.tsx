import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Popconfirm,
  Space,
  Table,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState } from 'react';
import { useApiBase } from '../../context/ApiBaseContext';
import { useArticles } from '../../hooks';
import { adminApi } from '../../utils/adminApi';
import type { Article } from '../../types';
import PageError from '../_common/PageError';
import PageLoading from '../_common/PageLoading';

const { TextArea } = Input;

/** 路由 /articles — 博客 CRUD */
export default function ArticlesPage() {
  const apiBase = useApiBase();
  const { articles, loading, error, reload } = useArticles();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Article> | null>(null);
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  if (loading) return <PageLoading />;
  if (error) return <PageError message={error} />;

  const openCreate = () => {
    setEditing({});
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (record: Article) => {
    setEditing(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleSave = async () => {
    const values = await form.validateFields();
    setSaving(true);
    try {
      if (editing?.id) {
        await adminApi.updateArticle(apiBase, editing.id, values);
        message.success('文章已更新');
      } else {
        await adminApi.createArticle(apiBase, values);
        message.success('文章已创建');
      }
      setModalOpen(false);
      reload();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    await adminApi.deleteArticle(apiBase, id);
    message.success('已删除');
    reload();
  };

  const columns: ColumnsType<Article> = [
    { title: '标题', dataIndex: 'title', ellipsis: true },
    { title: '分类', dataIndex: 'category', width: 120 },
    {
      title: '发布时间',
      dataIndex: 'publishedAt',
      width: 120,
      render: (v: string) => new Date(v).toLocaleDateString(),
    },
    {
      title: '操作',
      width: 140,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => openEdit(record)}>
            编辑
          </Button>
          <Popconfirm title="确定删除该文章？" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="博客管理"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          新建文章
        </Button>
      }
    >
      <Table rowKey="id" columns={columns} dataSource={articles} pagination={{ pageSize: 10 }} />

      <Modal
        title={editing?.id ? '编辑文章' : '新建文章'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSave}
        confirmLoading={saving}
        width={640}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="标题" rules={[{ required: true, message: '请输入标题' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="summary" label="摘要">
            <Input />
          </Form.Item>
          <Form.Item name="category" label="分类">
            <Input />
          </Form.Item>
          <Form.Item name="tags" label="标签（逗号分隔）">
            <Input />
          </Form.Item>
          <Form.Item
            name="content"
            label="正文（Markdown）"
            rules={[{ required: true, message: '请输入正文' }]}
          >
            <TextArea rows={10} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
