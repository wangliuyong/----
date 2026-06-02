import {
  Button,
  Card,
  Drawer,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import PageError from '../../../components/_common/PageError';
import PageLoading from '../../../components/_common/PageLoading';
import PermissionGuard from '../../../components/PermissionGuard';
import { useApiBase } from '../../../context/ApiBaseContext';
import { ICON_OPTIONS } from '../../../router/iconRegistry';
import { buildModuleTree } from '../../../router/menuUtils';
import { PAGE_REGISTRY_OPTIONS } from '../../../router/pageRegistry';
import type { AdminModuleRecord, AdminPermissionItem } from '../../../types/rbac';
import { adminApi } from '../../../utils/adminApi';

/** 模块管理：菜单树 + 权限点维护 */
export default function ModulesPage() {
  const apiBase = useApiBase();
  const [modules, setModules] = useState<AdminModuleRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [moduleModal, setModuleModal] = useState(false);
  const [editingModule, setEditingModule] = useState<Partial<AdminModuleRecord> | null>(null);
  const [moduleForm] = Form.useForm();

  const [permDrawer, setPermDrawer] = useState(false);
  const [activeModule, setActiveModule] = useState<AdminModuleRecord | null>(null);
  const [permissions, setPermissions] = useState<AdminPermissionItem[]>([]);
  const [permModal, setPermModal] = useState(false);
  const [editingPerm, setEditingPerm] = useState<Partial<AdminPermissionItem> | null>(null);
  const [permForm] = Form.useForm();

  const loadModules = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setModules(await adminApi.listModules(apiBase));
    } catch (e) {
      setError(e instanceof Error ? e.message : '加载失败');
    } finally {
      setLoading(false);
    }
  }, [apiBase]);

  useEffect(() => {
    loadModules();
  }, [loadModules]);

  const treeData = useMemo(() => buildModuleTree(modules), [modules]);

  const parentOptions = modules
    .filter((m) => m.type === 'dir')
    .map((m) => ({ label: m.name, value: m.id }));

  const openModuleForm = (record?: AdminModuleRecord) => {
    setEditingModule(record ?? {});
    moduleForm.setFieldsValue(record ?? { type: 'menu', sort: 0, status: 1 });
    setModuleModal(true);
  };

  const saveModule = async () => {
    const values = await moduleForm.validateFields();
    if (editingModule?.id) {
      await adminApi.updateModule(apiBase, editingModule.id, values);
      message.success('模块已更新');
    } else {
      await adminApi.createModule(apiBase, values);
      message.success('模块已创建');
    }
    setModuleModal(false);
    loadModules();
  };

  const openPermissions = async (record: AdminModuleRecord) => {
    setActiveModule(record);
    setPermDrawer(true);
    setPermissions(await adminApi.listModulePermissions(apiBase, record.id));
  };

  const savePermission = async () => {
    if (!activeModule) return;
    const values = await permForm.validateFields();
    if (editingPerm?.id) {
      await adminApi.updatePermission(apiBase, editingPerm.id, values);
    } else {
      await adminApi.createPermission(apiBase, activeModule.id, values);
    }
    message.success('权限点已保存');
    setPermModal(false);
    setPermissions(await adminApi.listModulePermissions(apiBase, activeModule.id));
  };

  const columns: ColumnsType<AdminModuleRecord & { children?: AdminModuleRecord[] }> = [
    { title: '名称', dataIndex: 'name', width: 180 },
    { title: '编码', dataIndex: 'code', width: 140 },
    {
      title: '类型',
      dataIndex: 'type',
      width: 80,
      render: (v: string) => (v === 'dir' ? '目录' : '菜单'),
    },
    { title: '路由', dataIndex: 'path', width: 140 },
    { title: '组件', dataIndex: 'component', width: 120 },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      render: (v: number) => (v === 1 ? <Tag color="green">启用</Tag> : <Tag>禁用</Tag>),
    },
    {
      title: '操作',
      width: 220,
      render: (_, record) => (
        <Space>
          <PermissionGuard code="admin:system:modules:update">
            <Button type="link" size="small" onClick={() => openModuleForm(record)}>
              编辑
            </Button>
          </PermissionGuard>
          {record.type === 'menu' && (
            <PermissionGuard code="admin:system:modules:view">
              <Button type="link" size="small" onClick={() => openPermissions(record)}>
                权限点
              </Button>
            </PermissionGuard>
          )}
          <PermissionGuard code="admin:system:modules:delete">
            <Popconfirm title="确定删除？" onConfirm={async () => {
              await adminApi.deleteModule(apiBase, record.id);
              message.success('已删除');
              loadModules();
            }}>
              <Button type="link" size="small" danger>
                删除
              </Button>
            </Popconfirm>
          </PermissionGuard>
        </Space>
      ),
    },
  ];

  if (loading) return <PageLoading />;
  if (error) return <PageError message={error} />;

  return (
    <Card
      title="模块管理"
      extra={
        <PermissionGuard code="admin:system:modules:create">
          <Button type="primary" onClick={() => openModuleForm()}>
            新建模块
          </Button>
        </PermissionGuard>
      }
    >
      <Table rowKey="id" columns={columns} dataSource={treeData} pagination={false} />

      <Modal
        title={editingModule?.id ? '编辑模块' : '新建模块'}
        open={moduleModal}
        onCancel={() => setModuleModal(false)}
        onOk={saveModule}
        width={560}
        destroyOnClose
      >
        <Form form={moduleForm} layout="vertical">
          <Form.Item name="name" label="名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="code" label="编码" rules={[{ required: true }]}>
            <Input disabled={Boolean(editingModule?.id)} />
          </Form.Item>
          <Form.Item name="type" label="类型" rules={[{ required: true }]}>
            <Select options={[
              { label: '目录', value: 'dir' },
              { label: '菜单', value: 'menu' },
            ]} />
          </Form.Item>
          <Form.Item name="parentId" label="上级目录">
            <Select allowClear options={parentOptions} placeholder="无（顶级）" />
          </Form.Item>
          <Form.Item name="path" label="路由 path">
            <Input placeholder="如 site 或 system/modules" />
          </Form.Item>
          <Form.Item name="component" label="页面组件">
            <Select allowClear options={PAGE_REGISTRY_OPTIONS} />
          </Form.Item>
          <Form.Item name="icon" label="图标">
            <Select allowClear options={ICON_OPTIONS} />
          </Form.Item>
          <Form.Item name="sort" label="排序">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select options={[
              { label: '启用', value: 1 },
              { label: '禁用', value: 0 },
            ]} />
          </Form.Item>
        </Form>
      </Modal>

      <Drawer
        title={`权限点 — ${activeModule?.name ?? ''}`}
        open={permDrawer}
        onClose={() => setPermDrawer(false)}
        width={640}
      >
        <PermissionGuard code="admin:system:modules:update">
          <Button
            type="primary"
            style={{ marginBottom: 16 }}
            onClick={() => {
              setEditingPerm({});
              permForm.resetFields();
              setPermModal(true);
            }}
          >
            新建权限点
          </Button>
        </PermissionGuard>
        <Table
          rowKey="id"
          dataSource={permissions}
          pagination={false}
          columns={[
            { title: '名称', dataIndex: 'name' },
            { title: '编码', dataIndex: 'code' },
            { title: '类型', dataIndex: 'type' },
            {
              title: '操作',
              render: (_, row) => (
                <Space>
                  <Button type="link" size="small" onClick={() => {
                    setEditingPerm(row);
                    permForm.setFieldsValue(row);
                    setPermModal(true);
                  }}>
                    编辑
                  </Button>
                  <Popconfirm title="确定删除？" onConfirm={async () => {
                    await adminApi.deletePermission(apiBase, row.id);
                    if (activeModule) {
                      setPermissions(await adminApi.listModulePermissions(apiBase, activeModule.id));
                    }
                  }}>
                    <Button type="link" size="small" danger>
                      删除
                    </Button>
                  </Popconfirm>
                </Space>
              ),
            },
          ]}
        />
      </Drawer>

      <Modal
        title={editingPerm?.id ? '编辑权限点' : '新建权限点'}
        open={permModal}
        onCancel={() => setPermModal(false)}
        onOk={savePermission}
        destroyOnClose
      >
        <Form form={permForm} layout="vertical" initialValues={{ type: 'button', sort: 0 }}>
          <Form.Item name="name" label="名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="code" label="编码" rules={[{ required: true }]}>
            <Input placeholder="admin:xxx:view" disabled={Boolean(editingPerm?.id)} />
          </Form.Item>
          <Form.Item name="type" label="类型" rules={[{ required: true }]}>
            <Select options={[
              { label: '菜单', value: 'menu' },
              { label: '按钮', value: 'button' },
              { label: 'API', value: 'api' },
            ]} />
          </Form.Item>
          <Form.Item name="sort" label="排序">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
