import { Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { AdminUserRecord } from '../../../../types/rbac';

/** 用户管理表格列 */
export const USER_CRUD_COLUMNS: ColumnsType<AdminUserRecord> = [
  { title: '用户名', dataIndex: 'username' },
  { title: '昵称', dataIndex: 'nickname' },
  {
    title: '角色',
    dataIndex: 'roles',
    render: (rs: AdminUserRecord['roles']) =>
      rs.map((r) => <Tag key={r.role.id}>{r.role.name}</Tag>),
  },
  {
    title: '状态',
    dataIndex: 'status',
    render: (v: number) => (v === 1 ? '启用' : '禁用'),
  },
];
