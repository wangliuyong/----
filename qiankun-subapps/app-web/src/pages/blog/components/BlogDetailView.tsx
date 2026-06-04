import {
  AppLink,
  ArticleBody,
  PageTitle,
  SubApp,
} from '../../../../../_shared/components';
import { formatDate } from '../../../../../_shared/utils';
import type { Article } from '../../../../../_shared/contentTypes';
import { renderMarkdownHtml } from '../../../utils/markdown';

export interface BlogDetailViewProps {
  article: Article;
}

/** 博客文章详情视图 */
export default function BlogDetailView({ article }: BlogDetailViewProps) {
  return (
    <SubApp className="max-w-3xl">
      <AppLink href="/blog" variant="back" className="mb-4 app-back-link">
        返回列表
      </AppLink>
      <PageTitle className="mb-0">{article.title}</PageTitle>
      <p className="text-sm text-faint my-2 app-section">
        {formatDate(article.publishedAt)}
        {article.category ? ` · ${article.category}` : ''}
      </p>
      <ArticleBody className="app-article-body" html={renderMarkdownHtml(article.content)} />
    </SubApp>
  );
}
