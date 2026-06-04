import type { ColumnsType } from 'antd/es/table';
import type { Article } from '../../../types';

/** 博客管理表格列 */
export const ARTICLE_COLUMNS: ColumnsType<Article> = [
  { title: '标题', dataIndex: 'title', ellipsis: true },
  { title: '分类', dataIndex: 'category', width: 120 },
  {
    title: '发布时间',
    dataIndex: 'publishedAt',
    width: 120,
    render: (v: string) => new Date(v).toLocaleDateString(),
  },
];
