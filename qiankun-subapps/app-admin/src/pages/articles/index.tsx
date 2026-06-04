import { createArticle, deleteArticle, updateArticle } from '../../api/articles.api';
import AdminCrudPage from '../../components/AdminCrudPage';
import type { Article } from '../../types';
import ArticleFormFields from './components/ArticleFormFields';
import { ARTICLE_COLUMNS } from './components/articleColumns';
import { useArticles } from './useArticles';

/** 路由 articles — 博客 CRUD */
export default function ArticlesPage() {
  const { articles, loading, reload } = useArticles();

  return (
    <AdminCrudPage<Article>
      title="博客管理"
      createLabel="新建文章"
      data={articles}
      loading={loading}
      createPermission="admin:articles:create"
      updatePermission="admin:articles:update"
      deletePermission="admin:articles:delete"
      columns={ARTICLE_COLUMNS}
      deleteConfirmTitle="确定删除该文章？"
      modalTitles={{ create: '新建文章', edit: '编辑文章' }}
      modalWidth={640}
      onCreate={(values) => createArticle(values)}
      onUpdate={(id, values) => updateArticle(id, values)}
      onDelete={(id) => deleteArticle(id)}
      onReload={reload}
      renderForm={() => <ArticleFormFields />}
    />
  );
}
