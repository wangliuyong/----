import type { ColumnsType } from 'antd/es/table';
import type { LinkItem } from '../../../types';

export const LINK_COLUMNS: ColumnsType<LinkItem> = [
  { title: '名称', dataIndex: 'name', width: 140 },
  { title: '链接', dataIndex: 'url', ellipsis: true },
  { title: '描述', dataIndex: 'description', ellipsis: true },
  { title: '排序', dataIndex: 'sort', width: 80 },
];
