import {
  AppButton,
  AppInput,
  AppLink,
  AppListItem,
  ArticleBody,
  PageTitle,
  SubApp,
} from '../../../../_shared/components';
import { formatDate } from '../../../../_shared/utils';
import PageLoading from '../../components/_common/PageLoading';
import { renderMarkdownHtml } from '../../utils/markdown';
import { useBlog } from './useBlog';

/** 博客：列表 / 详情 / 分类标签筛选（原 app-blog） */
export default function BlogPage() {
  const {
    mode,
    articles,
    detail,
    filterCategory,
    setFilterCategory,
    filterTag,
    setFilterTag,
    categories,
    loading,
    error,
    reload,
  } = useBlog();

  if (loading) {
    return <PageLoading />;
  }

  if (error) {
    return (
      <SubApp>
        <p className="text-red-500">{error}</p>
      </SubApp>
    );
  }

  if (mode === 'detail' && detail) {
    return (
      <article className="sub-app">
        <AppLink href="/blog" variant="back" className="mb-4">
          返回列表
        </AppLink>
        <PageTitle className="mb-0">{detail.title}</PageTitle>
        <p className="text-sm text-faint my-2">
          {formatDate(detail.publishedAt)}
          {detail.category ? ` · ${detail.category}` : ''}
        </p>
        <ArticleBody html={renderMarkdownHtml(detail.content)} />
      </article>
    );
  }

  return (
    <SubApp>
      <PageTitle className="mb-6">博客</PageTitle>
      <div className="flex flex-wrap gap-3 mb-6">
        <select
          className="app-input w-auto min-w-[140px]"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">全部分类</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <AppInput
          className="w-auto min-w-[140px]"
          placeholder="按标签筛选"
          value={filterTag}
          onChange={(e) => setFilterTag(e.target.value)}
        />
        <AppButton onClick={() => void reload()}>筛选</AppButton>
      </div>

      <div className="space-y-4">
        {articles.map((item) => (
          <AppListItem key={item.id}>
            <h2 className="text-xl font-semibold font-serif">
              <a
                href={`/blog/${item.id}`}
                className="app-list-item__title text-ink hover:no-underline"
              >
                {item.title}
              </a>
            </h2>
            <p className="text-muted mt-1">{item.summary || ''}</p>
            <p className="text-sm text-faint mt-2">
              {formatDate(item.publishedAt)}
            </p>
          </AppListItem>
        ))}
      </div>
    </SubApp>
  );
}
