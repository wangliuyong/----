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
import { useProjects } from '../../hooks';
import { adminApi } from '../../utils/adminApi';
import type { Project } from '../../types';
import PageError from '../_common/PageError';
import PageLoading from '../_common/PageLoading';

const { TextArea } = Input;

/** 路由 /projects — 项目 CRUD */
export default function ProjectsPage() {
  const apiBase = useApiBase();
  const { projects, loading, error, reload } = useProjects();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Project> | null>(null);
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  if (loading) return <PageLoading />;
  if (error) return <PageError message={error} />;

  const openCreate = () => {
    setEditing({});
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (record: Project) => {
    setEditing(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleSave = async () => {
    const values = await form.validateFields();
    setSaving(true);
    try {
      if (editing?.id) {
        await adminApi.updateProject(apiBase, editing.id, values);
        message.success('项目已更新');
      } else {
        await adminApi.createProject(apiBase, values);
        message.success('项目已创建');
      }
      setModalOpen(false);
      reload();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    await adminApi.deleteProject(apiBase, id);
    message.success('已删除');
    reload();
  };

  const columns: ColumnsType<Project> = [
    { title: '项目名称', dataIndex: 'name', width: 180 },
    { title: '描述', dataIndex: 'desc', ellipsis: true },
    { title: '技术栈', dataIndex: 'techStack', width: 140 },
    {
      title: '操作',
      width: 140,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => openEdit(record)}>
            编辑
          </Button>
          <Popconfirm title="确定删除该项目？" onConfirm={() => handleDelete(record.id)}>
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
      title="项目管理"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          新建项目
        </Button>
      }
    >
      <Table rowKey="id" columns={columns} dataSource={projects} pagination={{ pageSize: 10 }} />

      <Modal
        title={editing?.id ? '编辑项目' : '新建项目'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSave}
        confirmLoading={saving}
        width={560}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="项目名称" rules={[{ required: true, message: '请输入名称' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="desc" label="项目描述" rules={[{ required: true, message: '请输入描述' }]}>
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item name="techStack" label="技术栈">
            <Input placeholder="React, NestJS, Docker..." />
          </Form.Item>
          <Form.Item name="githubUrl" label="GitHub URL">
            <Input />
          </Form.Item>
          <Form.Item name="previewUrl" label="预览 URL">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
