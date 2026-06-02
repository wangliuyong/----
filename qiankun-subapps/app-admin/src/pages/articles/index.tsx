import { ArticlesPanel } from '../../components/AdminPanels';
import PageError from '../../components/PageError';
import { useArticles } from '../../hooks/useArticles';
import PageLoading from '../_common/PageLoading';
import { useApiBase } from '../../context/ApiBaseContext';

/** 路由 /articles — 博客 CRUD */
export default function ArticlesPage() {
  const apiBase = useApiBase();
  const { articles, loading, error, reload } = useArticles();

  if (loading) return <PageLoading />;

  return (
    <>
      <PageError message={error} />
      <ArticlesPanel apiBase={apiBase} articles={articles} onRefresh={reload} />
    </>
  );
}
