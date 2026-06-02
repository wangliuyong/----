import {
  AppButton,
  AppInput,
  AppLink,
  ArticleBody,
  PageTitle,
  SubApp,
} from '../../../../_shared/components';
import { formatDate } from '../../../../_shared/utils';
import { Link } from 'react-router-dom';
import PageLoading from '../../components/_common/PageLoading';
import { blogDetailPath } from '../../router/routes';
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
      <SubApp className="max-w-3xl">
        <AppLink href="/blog" variant="back" className="mb-4">
          返回列表
        </AppLink>
        <PageTitle className="mb-0">{detail.title}</PageTitle>
        <p className="text-sm text-faint my-2">
          {formatDate(detail.publishedAt)}
          {detail.category ? ` · ${detail.category}` : ''}
        </p>
        <ArticleBody html={renderMarkdownHtml(detail.content)} />
      </SubApp>
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
          onBlur={(e) => setFilterCategory(e.target.value)}
        />
        <AppButton onClick={() => void reload()}>筛选</AppButton>
      </div>

      <ul className="home-post-list app-stagger">
        {articles.map((item) => (
          <li className="home-post-item" key={item.id}>
            <Link className="home-post-link" to={blogDetailPath(item.id)}>
              <time className="home-post-meta" dateTime={item.publishedAt}>
                {formatDate(item.publishedAt)}
              </time>
              <div className="home-post-body">
                <h2 className="home-post-title">{item.title}</h2>
                <p className="home-post-summary">{item.summary || '暂无摘要'}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </SubApp>
  );
}
