import type { ColumnsType } from 'antd/es/table';
import type { Project } from '../../../types';

export const PROJECT_COLUMNS: ColumnsType<Project> = [
  { title: '项目名称', dataIndex: 'name', width: 180 },
  { title: '描述', dataIndex: 'desc', ellipsis: true },
  { title: '技术栈', dataIndex: 'techStack', width: 140 },
];
