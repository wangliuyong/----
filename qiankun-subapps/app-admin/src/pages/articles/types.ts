import type { Article } from '../../types';

/** /admin/articles 页面入参 */
export interface ArticlesPageProps {
  apiBase: string;
  articles: Article[];
  onRefresh: () => void;
}
