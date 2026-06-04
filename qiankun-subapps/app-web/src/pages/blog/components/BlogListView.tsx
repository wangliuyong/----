import { PageTitle, SubApp } from '../../../../../_shared/components';
import type { Article } from '../../../../../_shared/contentTypes';
import BlogArticleList from './BlogArticleList';
import BlogListFilters from './BlogListFilters';

export interface BlogListViewProps {
  articles: Article[];
  filterCategory: string;
  categories: string[];
  onCategoryChange: (value: string) => void;
  onTagBlur: (value: string) => void;
  onReload: () => void;
}

/** 博客列表页主视图 */
export default function BlogListView({
  articles,
  filterCategory,
  categories,
  onCategoryChange,
  onTagBlur,
  onReload,
}: BlogListViewProps) {
  return (
    <SubApp>
      <PageTitle className="mb-6">博客</PageTitle>
      <BlogListFilters
        filterCategory={filterCategory}
        categories={categories}
        onCategoryChange={onCategoryChange}
        onTagBlur={onTagBlur}
        onReload={onReload}
      />
      <BlogArticleList articles={articles} />
    </SubApp>
  );
}
