import { useParams } from 'react-router-dom';
import ArticleEditorPage from '../components/ArticleEditorPage';

/** 路由 articles/edit/:id — 编辑博客文章 */
export default function ArticleEditPage() {
  const { id } = useParams<{ id: string }>();
  const articleId = Number(id);

  if (!Number.isFinite(articleId)) {
    return null;
  }

  return <ArticleEditorPage mode="edit" articleId={articleId} />;
}
