import { Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { AiSyncRecord } from '../../../../api/ai.api';
import { formatSyncRecordSources } from '../utils/formatSyncRecordSources';

/** 最近同步记录表格列 */
export const SYNC_RECORD_COLUMNS: ColumnsType<AiSyncRecord> = [
  {
    title: '同步范围',
    dataIndex: 'sources',
    render: (sources: AiSyncRecord['sources']) => {
      const parts = formatSyncRecordSources(sources);
      if (!parts.length) return '-';
      return parts.map((p) => (
        <Tag key={p.label} style={{ marginBottom: 4 }}>
          {p.count > 0 ? `${p.label}(${p.count}条)` : p.label}
        </Tag>
      ));
    },
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    render: (v: string) => {
      const color = v === 'success' ? 'green' : v === 'partial' ? 'orange' : 'blue';
      return <Tag color={color}>{v}</Tag>;
    },
  },
  { title: '向量块数', dataIndex: 'chunkCount', width: 100 },
  {
    title: '开始时间',
    dataIndex: 'startedAt',
    width: 170,
    render: (v: string) => new Date(v).toLocaleString(),
  },
  {
    title: '错误',
    dataIndex: 'error',
    ellipsis: true,
    render: (v: string | null) => v ?? '-',
  },
];
