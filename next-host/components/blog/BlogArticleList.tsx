import { formatDate } from '@shared/utils/format';
import type { Article } from '@shared/contentTypes';
import { blogDetailPath } from '@/router';

export interface BlogArticleListProps {
  articles: Article[];
}

/** 博客文章列表（SSR 友好，使用原生 a 标签） */
export default function BlogArticleList({ articles }: BlogArticleListProps) {
  return (
    <ul className="home-post-list">
      {articles.map((item) => (
        <li className="home-post-item" key={item.id}>
          <a className="home-post-link" href={blogDetailPath(item.id)}>
            <time className="home-post-meta" dateTime={item.publishedAt}>
              {formatDate(item.publishedAt)}
            </time>
            <div className="home-post-body">
              <h2 className="home-post-title">{item.title}</h2>
              <p className="home-post-summary">{item.summary || '暂无摘要'}</p>
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
}
