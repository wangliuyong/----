import { Table } from 'antd';
import type { SourceSyncResult } from '../../../../api/ai.api';
import { SYNC_RESULT_COLUMNS } from './syncResultColumns';

export interface SyncResultTableProps {
  results: SourceSyncResult[];
}

/** 向量化同步结果表格 */
export default function SyncResultTable({ results }: SyncResultTableProps) {
  return (
    <Table
      style={{ marginTop: 16 }}
      rowKey="source"
      size="small"
      columns={SYNC_RESULT_COLUMNS}
      dataSource={results}
      pagination={false}
    />
  );
}
