import type { ColumnsType } from 'antd/es/table';
import type { SyncCandidateItem } from '../../../../api/ai.api';

/** 同步候选记录表格列 */
export const SYNC_CANDIDATE_COLUMNS: ColumnsType<SyncCandidateItem> = [
  { title: '标题', dataIndex: 'title', ellipsis: true },
  {
    title: '说明',
    dataIndex: 'subtitle',
    ellipsis: true,
    render: (v?: string) => v ?? '-',
  },
];
