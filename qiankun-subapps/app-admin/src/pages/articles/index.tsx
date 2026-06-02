import { ArticlesPanel } from '../../components/AdminPanels';
import type { ArticlesPageProps } from './types';

/** /admin/articles — 博客 CRUD */
export default function ArticlesPage({ apiBase, articles, onRefresh }: ArticlesPageProps) {
  return <ArticlesPanel apiBase={apiBase} articles={articles} onRefresh={onRefresh} />;
}
