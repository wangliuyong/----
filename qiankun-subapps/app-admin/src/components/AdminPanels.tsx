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
  Typography,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import type { Article, Message, Project, SiteConfig } from '../types';
import { adminApi } from '../utils/adminApi';

const { TextArea } = Input;

// ========== 站点设置 ==========

interface SiteSettingsPanelProps {
  site: SiteConfig;
  onSave: (data: Partial<SiteConfig>) => Promise<void>;
}

/** 站点基础信息：名称、GitHub、邮箱 */
export function SiteSettingsPanel({ site, onSave }: SiteSettingsPanelProps) {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    form.setFieldsValue({
      siteName: site.siteName,
      githubUrl: site.githubUrl,
      email: site.email,
    });
  }, [site, form]);

  const handleSubmit = async (values: Partial<SiteConfig>) => {
    setSaving(true);
    try {
      await onSave(values);
      message.success('站点设置已保存');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card title="站点设置">
      <Form
        form={form}
        layout="vertical"
        style={{ maxWidth: 520 }}
        onFinish={handleSubmit}
      >
        <Form.Item
          label="站点名称"
          name="siteName"
          rules={[{ required: true, message: '请输入站点名称' }]}
        >
          <Input placeholder="显示在导航栏的站点名" />
        </Form.Item>
        <Form.Item label="GitHub 链接" name="githubUrl">
          <Input placeholder="https://github.com/..." />
        </Form.Item>
        <Form.Item label="联系邮箱" name="email">
          <Input placeholder="example@email.com" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={saving}>
            保存
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}

// ========== 导航管理 ==========

interface NavPanelProps {
  nav: SiteConfig['nav'];
  onSave: (nav: SiteConfig['nav']) => Promise<void>;
}

/** 前台导航项增删改 */
export function NavPanel({ nav, onSave }: NavPanelProps) {
  const [items, setItems] = useState(nav);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setItems(nav);
  }, [nav]);

  const updateItem = (index: number, key: 'href' | 'label', value: string) => {
    const next = [...items];
    next[index] = { ...next[index], [key]: value };
    setItems(next);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(items);
      message.success('导航已保存');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card
      title="导航管理"
      extra={
        <Space>
          <Button
            icon={<PlusOutlined />}
            onClick={() => setItems([...items, { href: '/', label: '新导航' }])}
          >
            添加
          </Button>
          <Button type="primary" loading={saving} onClick={handleSave}>
            保存导航
          </Button>
        </Space>
      }
    >
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        {items.map((item, index) => (
          <Space key={index} align="start" style={{ width: '100%' }}>
            <Input
              style={{ width: 200 }}
              placeholder="路径，如 /blog"
              value={item.href}
              onChange={(e) => updateItem(index, 'href', e.target.value)}
            />
            <Input
              style={{ width: 160 }}
              placeholder="显示标签"
              value={item.label}
              onChange={(e) => updateItem(index, 'label', e.target.value)}
            />
            <Button
              danger
              type="text"
              icon={<DeleteOutlined />}
              onClick={() => setItems(items.filter((_, j) => j !== index))}
            />
          </Space>
        ))}
        {items.length === 0 && (
          <Typography.Text type="secondary">暂无导航项，点击「添加」创建</Typography.Text>
        )}
      </Space>
    </Card>
  );
}

// ========== 博客管理 ==========

interface ArticlesPanelProps {
  apiBase: string;
  articles: Article[];
  onRefresh: () => void;
}

/** 博客文章 CRUD */
export function ArticlesPanel({ apiBase, articles, onRefresh }: ArticlesPanelProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Article> | null>(null);
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

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
      onRefresh();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    await adminApi.deleteArticle(apiBase, id);
    message.success('已删除');
    onRefresh();
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

// ========== 项目管理 ==========

interface ProjectsPanelProps {
  apiBase: string;
  projects: Project[];
  onRefresh: () => void;
}

/** 项目展示 CRUD */
export function ProjectsPanel({ apiBase, projects, onRefresh }: ProjectsPanelProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Project> | null>(null);
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

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
      onRefresh();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    await adminApi.deleteProject(apiBase, id);
    message.success('已删除');
    onRefresh();
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

// ========== 关于我 ==========

interface AboutPanelProps {
  about: SiteConfig['about'];
  onSave: (about: SiteConfig['about']) => Promise<void>;
}

/** 关于页 Profile JSON 编辑 */
export function AboutPanel({ about, onSave }: AboutPanelProps) {
  const [json, setJson] = useState(JSON.stringify(about, null, 2));
  const [parseError, setParseError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setJson(JSON.stringify(about, null, 2));
  }, [about]);

  const handleSave = async () => {
    try {
      const parsed = JSON.parse(json);
      setParseError('');
      setSaving(true);
      await onSave(parsed);
      message.success('关于我已保存');
    } catch {
      setParseError('JSON 格式错误，请检查语法');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card
      title="关于我"
      extra={
        <Button type="primary" loading={saving} onClick={handleSave}>
          保存
        </Button>
      }
    >
      <Typography.Paragraph type="secondary">
        编辑 Profile JSON（与前台关于页结构一致，保存后即时生效）
      </Typography.Paragraph>
      <TextArea
        value={json}
        onChange={(e) => setJson(e.target.value)}
        rows={22}
        style={{ fontFamily: 'monospace', fontSize: 12 }}
      />
      {parseError && (
        <Typography.Text type="danger" style={{ display: 'block', marginTop: 8 }}>
          {parseError}
        </Typography.Text>
      )}
    </Card>
  );
}

// ========== 联系我 ==========

interface ContactPanelProps {
  site: SiteConfig;
  onSave: (
    contact: SiteConfig['contact'],
    email?: string,
    githubUrl?: string,
  ) => Promise<void>;
}

/** 联系页展示信息与邮箱、GitHub */
export function ContactPanel({ site, onSave }: ContactPanelProps) {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    form.setFieldsValue({
      email: site.email,
      githubUrl: site.githubUrl,
      intro: site.contact.intro || '',
    });
  }, [site, form]);

  const handleSubmit = async (values: {
    email: string;
    githubUrl: string;
    intro: string;
  }) => {
    setSaving(true);
    try {
      await onSave({ intro: values.intro }, values.email, values.githubUrl);
      message.success('联系信息已保存');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card title="联系我">
      <Form
        form={form}
        layout="vertical"
        style={{ maxWidth: 520 }}
        onFinish={handleSubmit}
      >
        <Form.Item label="展示邮箱" name="email">
          <Input />
        </Form.Item>
        <Form.Item label="GitHub 链接" name="githubUrl">
          <Input />
        </Form.Item>
        <Form.Item label="页面说明文案" name="intro">
          <TextArea rows={3} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={saving}>
            保存
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}

// ========== 留言管理 ==========

interface MessagesPanelProps {
  apiBase: string;
  messages: Message[];
  onRefresh: () => void;
}

/** 前台留言列表与删除 */
export function MessagesPanel({ apiBase, messages, onRefresh }: MessagesPanelProps) {
  const handleDelete = async (id: number) => {
    await adminApi.deleteMessage(apiBase, id);
    message.success('已删除');
    onRefresh();
  };

  const columns: ColumnsType<Message> = [
    { title: '昵称', dataIndex: 'nickname', width: 120 },
    { title: '联系方式', dataIndex: 'contact', width: 160 },
    {
      title: '留言内容',
      dataIndex: 'content',
      ellipsis: true,
    },
    {
      title: '时间',
      dataIndex: 'createdAt',
      width: 170,
      render: (v: string) => new Date(v).toLocaleString(),
    },
    {
      title: '操作',
      width: 80,
      render: (_, record) => (
        <Popconfirm title="确定删除该留言？" onConfirm={() => handleDelete(record.id)}>
          <Button type="link" size="small" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  return (
    <Card title="留言管理">
      <Table
        rowKey="id"
        columns={columns}
        dataSource={messages}
        pagination={{ pageSize: 10 }}
        locale={{ emptyText: '暂无留言' }}
      />
    </Card>
  );
}
