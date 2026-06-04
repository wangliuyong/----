import { SearchOutlined } from '@ant-design/icons';
import { Input, Table, Tabs } from 'antd';
import type { TableRowSelection } from 'antd/es/table/interface';
import {
  AI_SOURCE_OPTIONS,
  type AiDataSource,
  type SyncCandidateItem,
} from '../../../../api/ai.api';
import { SYNC_CANDIDATE_COLUMNS } from './syncCandidateColumns';

export interface SyncCandidatePanelProps {
  activeSource: AiDataSource;
  onActiveSourceChange: (source: AiDataSource) => void;
  selection: Record<AiDataSource, string[]>;
  onSelectionChange: (source: AiDataSource, keys: string[]) => void;
  candidates: SyncCandidateItem[];
  loading: boolean;
  keyword: string;
  onKeywordChange: (value: string) => void;
}

/** 向量化弹窗内：Tab + 搜索 + 候选记录多选表 */
export default function SyncCandidatePanel({
  activeSource,
  onActiveSourceChange,
  selection,
  onSelectionChange,
  candidates,
  loading,
  keyword,
  onKeywordChange,
}: SyncCandidatePanelProps) {
  const tabItems = AI_SOURCE_OPTIONS.map((opt) => {
    const count = selection[opt.value]?.length ?? 0;
    return {
      key: opt.value,
      label: count > 0 ? `${opt.label} (${count})` : opt.label,
      children: null,
    };
  });

  const rowSelection: TableRowSelection<SyncCandidateItem> = {
    selectedRowKeys: selection[activeSource],
    onChange: (keys) => onSelectionChange(activeSource, keys as string[]),
    preserveSelectedRowKeys: true,
  };

  return (
    <>
      <Tabs
        activeKey={activeSource}
        onChange={(key) => {
          onActiveSourceChange(key as AiDataSource);
          onKeywordChange('');
        }}
        items={tabItems}
        style={{ marginBottom: 12 }}
      />

      <Input
        allowClear
        prefix={<SearchOutlined />}
        placeholder="搜索标题或说明"
        value={keyword}
        onChange={(e) => onKeywordChange(e.target.value)}
        style={{ marginBottom: 12 }}
      />

      <Table
        rowKey="id"
        size="small"
        loading={loading}
        columns={SYNC_CANDIDATE_COLUMNS}
        dataSource={candidates}
        rowSelection={rowSelection}
        pagination={{ pageSize: 8, showSizeChanger: false }}
        locale={{ emptyText: '该数据源下暂无可同步数据' }}
        scroll={{ y: 320 }}
      />
    </>
  );
}
