import { Card, Table } from 'antd';
import { ADMIN_TABLE_DEFAULTS, mergeAdminTablePagination } from '../../../../components/admin-page';
import type { AiSyncRecord } from '../../../../api/ai.api';
import { SYNC_RECORD_COLUMNS } from './syncRecordColumns';

export interface SyncRecordsTableProps {
  records: AiSyncRecord[];
}

/** 最近同步记录内嵌表格 */
export default function SyncRecordsTable({ records }: SyncRecordsTableProps) {
  return (
    <Card type="inner" title="最近同步记录" size="small">
      <Table
        rowKey="id"
        columns={SYNC_RECORD_COLUMNS}
        dataSource={records}
        size={ADMIN_TABLE_DEFAULTS.size}
        className={ADMIN_TABLE_DEFAULTS.className}
        pagination={mergeAdminTablePagination({ pageSize: 5, total: records.length })}
        locale={{ emptyText: '暂无同步记录' }}
      />
    </Card>
  );
}
