import { SubApp } from '../../../../_shared/components';
import PageLoading from '../../components/_common/PageLoading';
import BlogDetailView from './components/BlogDetailView';
import BlogListView from './components/BlogListView';
import { useBlog } from './useBlog';

/** 路由 blog — 列表与详情 */
export default function BlogPage() {
  const {
    mode,
    articles,
    detail,
    filterCategory,
    setFilterCategory,
    setFilterTag,
    categories,
    loading,
    error,
    reload,
  } = useBlog();

  if (loading) return <PageLoading />;

  if (error) {
    return (
      <SubApp>
        <p className="text-red-500">{error}</p>
      </SubApp>
    );
  }

  if (mode === 'detail' && detail) {
    return <BlogDetailView article={detail} />;
  }

  return (
    <BlogListView
      articles={articles}
      filterCategory={filterCategory}
      categories={categories}
      onCategoryChange={setFilterCategory}
      onTagBlur={setFilterTag}
      onReload={() => void reload()}
    />
  );
}
