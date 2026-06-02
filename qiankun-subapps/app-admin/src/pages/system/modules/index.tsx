import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  TreeSelect,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import PageError from '../../../components/_common/PageError';
import PageLoading from '../../../components/_common/PageLoading';
import PermissionGuard from '../../../components/PermissionGuard';
import {
  createModule,
  createPermission,
  deleteModule,
  deletePermission,
  listModules,
  updateModule,
  updatePermission,
} from '../../../api/rbac/modules.api';
import { ICON_OPTIONS } from '../../../router/iconRegistry';
import {
  buildMenuParentTreeData,
  buildModuleAdminTree,
  isMenuGroup,
  isPageMenu,
  type ModuleAdminTreeNode,
} from '../../../router/moduleTreeUtils';
import { isPathRegistered } from '../../../router/pageRegistry';
import type { AdminModuleRecord } from '../../../types/rbac';

/** 菜单表单模式：一级新建 / 行内子菜单 / 编辑 */
type MenuFormMode = 'create-top' | 'create-child' | 'edit';

/** 模块管理：菜单与权限点同一棵树，权限点为叶子且不可展开 */
export default function ModulesPage() {
  const [modules, setModules] = useState<AdminModuleRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [menuModal, setMenuModal] = useState(false);
  const [menuFormMode, setMenuFormMode] = useState<MenuFormMode>('create-top');
  const [childParentMenu, setChildParentMenu] = useState<AdminModuleRecord | null>(null);
  const [editingMenu, setEditingMenu] = useState<Partial<AdminModuleRecord> | null>(null);
  const [menuForm] = Form.useForm();

  const [permModal, setPermModal] = useState(false);
  const [permParentMenu, setPermParentMenu] = useState<AdminModuleRecord | null>(null);
  const [editingPermId, setEditingPermId] = useState<number | null>(null);
  const [permForm] = Form.useForm();

  const loadModules = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setModules(await listModules());
    } catch (e) {
      setError(e instanceof Error ? e.message : '加载失败');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadModules();
  }, [loadModules]);

  const treeData = useMemo(() => buildModuleAdminTree(modules), [modules]);
  const parentTreeData = useMemo(
    () => buildMenuParentTreeData(modules, menuFormMode === 'edit' ? editingMenu?.id : undefined),
    [modules, menuFormMode, editingMenu?.id],
  );

  const openTopLevelMenuForm = () => {
    setMenuFormMode('create-top');
    setChildParentMenu(null);
    setEditingMenu({});
    menuForm.setFieldsValue({
      type: 'menu',
      sort: 0,
      status: 1,
      isGroup: true,
      parentId: undefined,
    });
    setMenuModal(true);
  };

  /** 在任意分组菜单下新建子菜单（上级可在树中调整，支持无限层级） */
  const openChildMenuForm = (parent: AdminModuleRecord) => {
    setMenuFormMode('create-child');
    setChildParentMenu(parent);
    setEditingMenu({});
    menuForm.setFieldsValue({
      type: 'menu',
      sort: 0,
      status: 1,
      isGroup: true,
      parentId: parent.id,
    });
    setMenuModal(true);
  };

  const openMenuFormEdit = (record: AdminModuleRecord) => {
    setMenuFormMode('edit');
    setChildParentMenu(null);
    setEditingMenu(record);
    menuForm.setFieldsValue({
      ...record,
      isGroup: isMenuGroup(record),
    });
    setMenuModal(true);
  };

  const openPermForm = (parentMenu: AdminModuleRecord, perm?: { id: number; name: string; code: string; sort: number }) => {
    setPermParentMenu(parentMenu);
    setEditingPermId(perm?.id ?? null);
    permForm.setFieldsValue(perm ?? { sort: 0 });
    setPermModal(true);
  };

  const menuModalTitle = useMemo(() => {
    if (menuFormMode === 'edit') return '编辑菜单';
    if (menuFormMode === 'create-child') return `新建子菜单 — ${childParentMenu?.name ?? ''}`;
    return '新建一级菜单';
  }, [menuFormMode, childParentMenu?.name]);

  const saveMenu = async () => {
    const values = await menuForm.validateFields();
    const isGroup = Boolean(values.isGroup);
    const payload = {
      name: values.name,
      code: values.code,
      type: 'menu',
      parentId:
        menuFormMode === 'create-top'
          ? undefined
          : menuFormMode === 'create-child'
            ? childParentMenu?.id
            : values.parentId,
      sort: values.sort,
      status: values.status,
      icon: values.icon,
      path: isGroup ? undefined : values.path,
    };
    if (editingMenu?.id) {
      await updateModule(editingMenu.id, payload);
      message.success('菜单已更新');
    } else {
      await createModule(payload);
      message.success('菜单已创建');
    }
    setMenuModal(false);
    loadModules();
  };

  const savePermission = async () => {
    if (!permParentMenu) return;
    const values = await permForm.validateFields();
    const payload = {
      name: values.name,
      code: values.code,
      type: 'button' as const,
      sort: values.sort ?? 0,
    };
    if (editingPermId) {
      await updatePermission(editingPermId, payload);
    } else {
      await createPermission(permParentMenu.id, payload);
    }
    message.success('权限点已保存');
    setPermModal(false);
    loadModules();
  };

  const columns: ColumnsType<ModuleAdminTreeNode> = [
    { title: '名称', dataIndex: 'name', width: 200 },
    { title: '编码', dataIndex: 'code', width: 200 },
    {
      title: '类型',
      dataIndex: 'type',
      width: 90,
      render: (v: string) =>
        v === 'permission' ? <Tag color="orange">权限点</Tag> : <Tag color="blue">菜单</Tag>,
    },
    {
      title: '路由',
      dataIndex: 'path',
      width: 200,
      render: (v: string | null | undefined, row) => {
        if (row.type === 'permission') return '—';
        if (!v) return '（分组）';
        return (
          <Space size={4}>
            <span>{v}</span>
            {isPathRegistered(v) ? (
              <Tag color="green">已匹配</Tag>
            ) : (
              <Tag color="red">未找到页面</Tag>
            )}
          </Space>
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      render: (v: number | undefined, row) =>
        row.type === 'permission' ? '—' : v === 1 ? <Tag color="green">启用</Tag> : <Tag>禁用</Tag>,
    },
    {
      title: '操作',
      width: 300,
      render: (_, record) => {
        if (record.type === 'permission') {
          return (
            <Space>
              <PermissionGuard code="admin:system:modules:update">
                <Button
                  type="link"
                  size="small"
                  onClick={() => {
                    const parent = modules.find((m) => m.id === record.moduleId);
                    if (!parent) return;
                    openPermForm(parent, {
                      id: record.permissionId!,
                      name: record.name,
                      code: record.code,
                      sort: record.sort ?? 0,
                    });
                  }}
                >
                  编辑
                </Button>
              </PermissionGuard>
              <PermissionGuard code="admin:system:modules:delete">
                <Popconfirm
                  title="确定删除该权限点？"
                  onConfirm={async () => {
                    await deletePermission(record.permissionId!);
                    message.success('已删除');
                    loadModules();
                  }}
                >
                  <Button type="link" size="small" danger>
                    删除
                  </Button>
                </Popconfirm>
              </PermissionGuard>
            </Space>
          );
        }

        const menuRecord = modules.find((m) => m.id === record.moduleId);

        return (
          <Space wrap>
            {menuRecord && isMenuGroup(menuRecord) && (
              <PermissionGuard code="admin:system:modules:create">
                <Button type="link" size="small" onClick={() => openChildMenuForm(menuRecord)}>
                  新增
                </Button>
              </PermissionGuard>
            )}
            {menuRecord && isPageMenu(menuRecord) && (
              <PermissionGuard code="admin:system:modules:update">
                <Button type="link" size="small" onClick={() => openPermForm(menuRecord)}>
                  新增
                </Button>
              </PermissionGuard>
            )}
            <PermissionGuard code="admin:system:modules:update">
              <Button
                type="link"
                size="small"
                onClick={() => menuRecord && openMenuFormEdit(menuRecord)}
              >
                编辑
              </Button>
            </PermissionGuard>
            <PermissionGuard code="admin:system:modules:delete">
              <Popconfirm
                title="确定删除？请先删除子菜单"
                onConfirm={async () => {
                  await deleteModule(record.moduleId!);
                  message.success('已删除');
                  loadModules();
                }}
              >
                <Button type="link" size="small" danger>
                  删除
                </Button>
              </Popconfirm>
            </PermissionGuard>
          </Space>
        );
      },
    },
  ];

  if (loading) return <PageLoading />;
  if (error) return <PageError message={error} />;

  return (
    <Card
      title="模块管理"
      extra={
        <PermissionGuard code="admin:system:modules:create">
          <Button type="primary" onClick={openTopLevelMenuForm}>
            新建
          </Button>
        </PermissionGuard>
      }
    >
      <Table
        rowKey="rowKey"
        columns={columns}
        dataSource={treeData}
        pagination={false}
        expandable={{
          /** 权限点无 children，不显示展开图标 */
          rowExpandable: (row) => Boolean(row.children?.length),
        }}
      />

      <Modal
        title={menuModalTitle}
        open={menuModal}
        onCancel={() => setMenuModal(false)}
        onOk={saveMenu}
        width={560}
        destroyOnClose
      >
        <Form form={menuForm} layout="vertical">
          <Form.Item name="name" label="名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="code" label="编码" rules={[{ required: true }]}>
            <Input disabled={Boolean(editingMenu?.id)} />
          </Form.Item>
          {menuFormMode === 'create-top' && (
            <Form.Item label="上级菜单">
              <Input value="无（顶级）" disabled />
            </Form.Item>
          )}
          {menuFormMode === 'create-child' && (
            <>
              <Form.Item name="parentId" hidden>
                <Input />
              </Form.Item>
              <Form.Item label="上级菜单">
                <Input value={childParentMenu?.name ?? ''} disabled />
              </Form.Item>
            </>
          )}
          {menuFormMode === 'edit' && (
            <Form.Item
              name="parentId"
              label="上级菜单"
              extra="仅分组菜单可选，支持任意层级嵌套"
            >
              <TreeSelect
                allowClear
                showSearch
                treeDefaultExpandAll
                treeLine
                treeData={parentTreeData}
                placeholder="无（顶级）"
                style={{ width: '100%' }}
                dropdownStyle={{ maxHeight: 360, overflow: 'auto' }}
                filterTreeNode={(input, node) =>
                  String(node.title ?? '')
                    .toLowerCase()
                    .includes(input.trim().toLowerCase())
                }
              />
            </Form.Item>
          )}
          <Form.Item name="isGroup" label="菜单类别">
            <Select
              options={[
                { label: '分组菜单（仅归类，无页面）', value: true },
                { label: '页面菜单（需配置路由 path）', value: false },
              ]}
            />
          </Form.Item>
          <Form.Item noStyle shouldUpdate={(prev, cur) => prev.isGroup !== cur.isGroup}>
            {({ getFieldValue }) =>
              !getFieldValue('isGroup') ? (
                <Form.Item
                  name="path"
                  label="路由 path"
                  rules={[{ required: true }]}
                  extra="与 pages 目录对应，如 site 或 system/modules"
                >
                  <Input placeholder="如 site 或 system/modules" />
                </Form.Item>
              ) : null
            }
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

      <Modal
        title={editingPermId ? `编辑权限点 — ${permParentMenu?.name}` : `新增权限点 — ${permParentMenu?.name}`}
        open={permModal}
        onCancel={() => setPermModal(false)}
        onOk={savePermission}
        destroyOnClose
      >
        <Form form={permForm} layout="vertical" initialValues={{ sort: 0 }}>
          <Form.Item name="name" label="名称" rules={[{ required: true }]}>
            <Input placeholder="如：新建、编辑、删除" />
          </Form.Item>
          <Form.Item name="code" label="权限编码" rules={[{ required: true }]}>
            <Input placeholder="admin:articles:create" disabled={Boolean(editingPermId)} />
          </Form.Item>
          <Form.Item name="sort" label="排序">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
