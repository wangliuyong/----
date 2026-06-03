import { Document } from '@langchain/core/documents';
import type { Article } from '@prisma/client';

/**
 * 将博客文章转为 LangChain Document。
 * metadata: source=articles, sourceId, title, slug
 */
export function loadArticles(articles: Article[]): Document[] {
  return articles.map((a) => {
    const parts = [
      `标题：${a.title}`,
      a.summary ? `摘要：${a.summary}` : '',
      a.category ? `分类：${a.category}` : '',
      a.tags ? `标签：${a.tags}` : '',
      `正文：\n${a.content}`,
    ].filter(Boolean);

    return new Document({
      pageContent: parts.join('\n'),
      metadata: {
        source: 'articles',
        sourceId: String(a.id),
        title: a.title,
        slug: a.slug ?? '',
      },
    });
  });
}
