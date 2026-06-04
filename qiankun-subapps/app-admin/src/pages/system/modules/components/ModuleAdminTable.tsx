import { Table } from 'antd';
import { useMemo } from 'react';
import type { ModuleAdminTreeNode } from '../../../../router/moduleTreeUtils';
import {
  createModuleAdminColumns,
  type ModuleAdminColumnHandlers,
} from './moduleAdminColumns';

export interface ModuleAdminTableProps {
  treeData: ModuleAdminTreeNode[];
  columnHandlers: ModuleAdminColumnHandlers;
}

/** 模块管理树形表格 */
export default function ModuleAdminTable({ treeData, columnHandlers }: ModuleAdminTableProps) {
  const columns = useMemo(
    () => createModuleAdminColumns(columnHandlers),
    [columnHandlers],
  );

  return (
    <Table
      rowKey="rowKey"
      columns={columns}
      dataSource={treeData}
      pagination={false}
      expandable={{
        rowExpandable: (row) => Boolean(row.children?.length),
      }}
    />
  );
}
