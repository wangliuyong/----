import { Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  AI_SOURCE_OPTIONS,
  type AiDataSource,
  type SourceSyncResult,
} from '../../../../api/ai.api';

/** 同步结果汇总表格列 */
export const SYNC_RESULT_COLUMNS: ColumnsType<SourceSyncResult> = [
  {
    title: '数据源',
    dataIndex: 'source',
    width: 100,
    render: (s: AiDataSource) => AI_SOURCE_OPTIONS.find((o) => o.value === s)?.label ?? s,
  },
  {
    title: '记录数',
    dataIndex: 'ids',
    width: 80,
    render: (ids: string[]) => ids?.length ?? 0,
  },
  { title: '向量块数', dataIndex: 'chunkCount', width: 90 },
  {
    title: '错误',
    dataIndex: 'error',
    render: (v?: string) => (v ? <Tag color="red">{v}</Tag> : '-'),
  },
];
