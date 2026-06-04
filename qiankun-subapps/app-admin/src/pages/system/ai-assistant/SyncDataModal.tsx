import { SearchOutlined } from '@ant-design/icons';
import { Alert, Input, Modal, Table, Tabs, Tag, message } from 'antd';
import type { ColumnsType, TableRowSelection } from 'antd/es/table/interface';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AI_SOURCE_OPTIONS,
  getAiSyncCandidates,
  syncAiItems,
  type AiDataSource,
  type AiSyncRecordItem,
  type SourceSyncResult,
  type SyncCandidateItem,
  type SyncItemPayload,
} from '../../../api/ai.api';

/** 各数据源已勾选的记录 id */
type SelectionMap = Record<AiDataSource, string[]>;

const EMPTY_SELECTION: SelectionMap = {
  articles: [],
  projects: [],
  messages: [],
  logs: [],
};

export interface SyncDataModalProps {
  open: boolean;
  syncing: boolean;
  onSyncingChange: (syncing: boolean) => void;
  onClose: () => void;
  onSuccess: () => void | Promise<void>;
}

/**
 * 向量化数据弹窗：按数据源 Tab 勾选具体记录，默认不选中任何数据。
 */
export default function SyncDataModal({
  open,
  syncing,
  onSyncingChange,
  onClose,
  onSuccess,
}: SyncDataModalProps) {
  const [activeSource, setActiveSource] = useState<AiDataSource>('articles');
  const [selection, setSelection] = useState<SelectionMap>({ ...EMPTY_SELECTION });
  const [candidates, setCandidates] = useState<Partial<Record<AiDataSource, SyncCandidateItem[]>>>({});
  const [loadingSource, setLoadingSource] = useState<AiDataSource | null>(null);
  const [keyword, setKeyword] = useState('');
  const [syncResults, setSyncResults] = useState<SourceSyncResult[] | null>(null);

  const resetState = useCallback(() => {
    setSelection({ ...EMPTY_SELECTION });
    setCandidates({});
    setKeyword('');
    setSyncResults(null);
    setActiveSource('articles');
  }, []);

  useEffect(() => {
    if (!open) {
      resetState();
      return;
    }
    void loadCandidates(activeSource);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 仅随弹窗打开与 Tab 切换加载
  }, [open, activeSource]);

  const loadCandidates = async (source: AiDataSource) => {
    if (candidates[source]) return;
    setLoadingSource(source);
    try {
      const list = await getAiSyncCandidates(source);
      setCandidates((prev) => ({ ...prev, [source]: list }));
    } finally {
      setLoadingSource(null);
    }
  };

  const filteredList = useMemo(() => {
    const list = candidates[activeSource] ?? [];
    const q = keyword.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle?.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q),
    );
  }, [activeSource, candidates, keyword]);

  const totalSelected = useMemo(
    () => AI_SOURCE_OPTIONS.reduce((sum, opt) => sum + (selection[opt.value]?.length ?? 0), 0),
    [selection],
  );

  const buildPayload = (): SyncItemPayload[] =>
    AI_SOURCE_OPTIONS.map((opt) => ({
      source: opt.value,
      ids: selection[opt.value] ?? [],
    })).filter((item) => item.ids.length > 0);

  const handleOk = async () => {
    const items = buildPayload();
    if (!items.length) {
      message.warning('请至少勾选一条要向量化的数据');
      return;
    }
    onSyncingChange(true);
    setSyncResults(null);
    try {
      const res = await syncAiItems(items);
      setSyncResults(res.results);
      const failed = res.results.filter((r) => r.error);
      if (failed.length) {
        message.error(`同步失败：${failed.map((r) => `${r.source}: ${r.error}`).join('；')}`);
      } else if (res.chunkCount === 0) {
        message.warning('同步完成，但未产生向量块（选中记录可能无有效内容）');
        onClose();
      } else {
        message.success(`同步完成，共写入 ${res.chunkCount} 个向量块`);
        onClose();
      }
      await onSuccess();
    } finally {
      onSyncingChange(false);
    }
  };

  const rowSelection: TableRowSelection<SyncCandidateItem> = {
    selectedRowKeys: selection[activeSource],
    onChange: (keys) => {
      setSelection((prev) => ({
        ...prev,
        [activeSource]: keys as string[],
      }));
    },
    preserveSelectedRowKeys: true,
  };

  const columns: ColumnsType<SyncCandidateItem> = [
    { title: '标题', dataIndex: 'title', ellipsis: true },
    {
      title: '说明',
      dataIndex: 'subtitle',
      ellipsis: true,
      render: (v?: string) => v ?? '-',
    },
  ];

  const resultColumns: ColumnsType<SourceSyncResult> = [
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

  const tabItems = AI_SOURCE_OPTIONS.map((opt) => {
    const count = selection[opt.value]?.length ?? 0;
    return {
      key: opt.value,
      label: count > 0 ? `${opt.label} (${count})` : opt.label,
      children: null,
    };
  });

  return (
    <Modal
      title="选择要向量化的数据"
      open={open}
      onCancel={() => !syncing && onClose()}
      onOk={handleOk}
      okText={totalSelected > 0 ? `同步已选 ${totalSelected} 条` : '确定同步'}
      okButtonProps={{ disabled: totalSelected === 0 }}
      confirmLoading={syncing}
      width={720}
      destroyOnClose
    >
      <Alert
        type="info"
        showIcon
        style={{ marginBottom: 12 }}
        message="仅对勾选的记录生成/更新向量，不会默认同步全库数据。"
      />

      <Tabs
        activeKey={activeSource}
        onChange={(key) => {
          setActiveSource(key as AiDataSource);
          setKeyword('');
        }}
        items={tabItems}
        style={{ marginBottom: 12 }}
      />

      <Input
        allowClear
        prefix={<SearchOutlined />}
        placeholder="搜索标题或说明"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        style={{ marginBottom: 12 }}
      />

      <Table
        rowKey="id"
        size="small"
        loading={loadingSource === activeSource}
        columns={columns}
        dataSource={filteredList}
        rowSelection={rowSelection}
        pagination={{ pageSize: 8, showSizeChanger: false }}
        locale={{ emptyText: '该数据源下暂无可同步数据' }}
        scroll={{ y: 320 }}
      />

      {syncResults && (
        <Table
          style={{ marginTop: 16 }}
          rowKey="source"
          size="small"
          columns={resultColumns}
          dataSource={syncResults}
          pagination={false}
        />
      )}
    </Modal>
  );
}

/** 解析同步记录中的 sources 字段（兼容旧版 string[]） */
export function formatSyncRecordSources(
  sources: AiSyncRecordItem[] | string[],
): { label: string; count: number }[] {
  if (!sources.length) return [];
  if (typeof sources[0] === 'string') {
    return (sources as string[]).map((s) => {
      const opt = AI_SOURCE_OPTIONS.find((o) => o.value === s);
      return { label: opt?.label ?? s, count: 0 };
    });
  }
  return (sources as AiSyncRecordItem[]).map((item) => {
    const opt = AI_SOURCE_OPTIONS.find((o) => o.value === item.source);
    return {
      label: opt?.label ?? String(item.source),
      count: item.ids?.length ?? 0,
    };
  });
}
