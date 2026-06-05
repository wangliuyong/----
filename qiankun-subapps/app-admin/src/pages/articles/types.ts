import type { Dayjs } from 'dayjs';

/** 博客新建/编辑表单值 */
export interface ArticleFormValues {
  title: string;
  summary?: string;
  category?: string;
  tags?: string;
  slug?: string;
  content: string;
  publishedAt?: Dayjs;
}
