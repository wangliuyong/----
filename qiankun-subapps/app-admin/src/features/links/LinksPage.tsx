import { Form, Input, InputNumber } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import AdminCrudPage from '../../components/AdminCrudPage';
import { useApiBase } from '../../context/ApiBaseContext';
import { adminApi } from '../../utils/adminApi';
import type { LinkItem } from '../../types';
import { useLinks } from './hooks/useLinks';

const columns: ColumnsType<LinkItem> = [
  { title: '名称', dataIndex: 'name', width: 140 },
  { title: '链接', dataIndex: 'url', ellipsis: true },
  { title: '描述', dataIndex: 'description', ellipsis: true },
  { title: '排序', dataIndex: 'sort', width: 80 },
];

/** 路由 /links — 友链 CRUD（与 nest-server /admin/links 对齐） */
export default function LinksPage() {
  const apiBase = useApiBase();
  const { links, loading, error, reload } = useLinks();

  return (
    <AdminCrudPage<LinkItem>
      title="友链管理"
      createLabel="新建友链"
      data={links}
      loading={loading}
      error={error}
      columns={columns}
      deleteConfirmTitle="确定删除该友链？"
      modalTitles={{ create: '新建友链', edit: '编辑友链' }}
      onCreate={(values) => adminApi.createLink(apiBase, values)}
      onUpdate={(id, values) => adminApi.updateLink(apiBase, id, values)}
      onDelete={(id) => adminApi.deleteLink(apiBase, id)}
      onReload={reload}
      renderForm={() => (
        <>
          <Form.Item name="name" label="名称" rules={[{ required: true, message: '请输入名称' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="url" label="链接" rules={[{ required: true, message: '请输入 URL' }]}>
            <Input placeholder="https://..." />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input />
          </Form.Item>
          <Form.Item name="avatar" label="头像 URL">
            <Input placeholder="https://..." />
          </Form.Item>
          <Form.Item name="sort" label="排序（越小越靠前）" initialValue={0}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </>
      )}
    />
  );
}
