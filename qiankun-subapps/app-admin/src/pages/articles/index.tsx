import { Form, Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import AdminCrudPage from '../../components/AdminCrudPage';
import { useApiBase } from '../../context/ApiBaseContext';
import { adminApi } from '../../utils/adminApi';
import type { Article } from '../../types';
import { useArticles } from './useArticles';

const { TextArea } = Input;

const columns: ColumnsType<Article> = [
  { title: '标题', dataIndex: 'title', ellipsis: true },
  { title: '分类', dataIndex: 'category', width: 120 },
  {
    title: '发布时间',
    dataIndex: 'publishedAt',
    width: 120,
    render: (v: string) => new Date(v).toLocaleDateString(),
  },
];

/** 路由 /articles — 博客 CRUD */
export default function ArticlesPage() {
  const apiBase = useApiBase();
  const { articles, loading, error, reload } = useArticles();

  return (
    <AdminCrudPage<Article>
      title="博客管理"
      createLabel="新建文章"
      data={articles}
      loading={loading}
      error={error}
      columns={columns}
      deleteConfirmTitle="确定删除该文章？"
      modalTitles={{ create: '新建文章', edit: '编辑文章' }}
      modalWidth={640}
      onCreate={(values) => adminApi.createArticle(apiBase, values)}
      onUpdate={(id, values) => adminApi.updateArticle(apiBase, id, values)}
      onDelete={(id) => adminApi.deleteArticle(apiBase, id)}
      onReload={reload}
      renderForm={() => (
        <>
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
        </>
      )}
    />
  );
}
