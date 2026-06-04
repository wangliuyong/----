import { formatDate } from '../../../../../_shared/utils';
import type { Article } from '../../../../../_shared/contentTypes';
import { Link } from 'react-router-dom';
import { blogDetailPath } from '../../../router/routes';

export interface BlogArticleListProps {
  articles: Article[];
}

/** 博客文章列表 */
export default function BlogArticleList({ articles }: BlogArticleListProps) {
  return (
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
  );
}
