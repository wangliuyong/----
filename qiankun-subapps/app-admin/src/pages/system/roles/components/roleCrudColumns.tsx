import { Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { AdminRoleRecord } from '../../../../types/rbac';

/** 角色管理表格列 */
export const ROLE_CRUD_COLUMNS: ColumnsType<AdminRoleRecord> = [
  { title: '名称', dataIndex: 'name' },
  { title: '编码', dataIndex: 'code' },
  {
    title: '超管',
    dataIndex: 'isSuper',
    render: (v: boolean) => (v ? <Tag color="gold">是</Tag> : '否'),
  },
  {
    title: '状态',
    dataIndex: 'status',
    render: (v: number) => (v === 1 ? '启用' : '禁用'),
  },
];
