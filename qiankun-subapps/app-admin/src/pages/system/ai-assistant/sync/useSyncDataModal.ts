import { message } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AI_SOURCE_OPTIONS,
  getAiSyncCandidates,
  syncAiItems,
  type AiDataSource,
  type SourceSyncResult,
  type SyncCandidateItem,
  type SyncItemPayload,
} from '../../../../api/ai.api';

/** 各数据源已勾选的记录 id */
export type SyncSelectionMap = Record<AiDataSource, string[]>;

const EMPTY_SELECTION: SyncSelectionMap = {
  articles: [],
  projects: [],
  messages: [],
  logs: [],
};

export interface UseSyncDataModalOptions {
  open: boolean;
  onSyncingChange: (syncing: boolean) => void;
  onClose: () => void;
  onSuccess: () => void | Promise<void>;
}

/**
 * 向量化弹窗状态：候选加载、勾选、过滤、提交同步。
 */
export function useSyncDataModal({
  open,
  onSyncingChange,
  onClose,
  onSuccess,
}: UseSyncDataModalOptions) {
  const [activeSource, setActiveSource] = useState<AiDataSource>('articles');
  const [selection, setSelection] = useState<SyncSelectionMap>({ ...EMPTY_SELECTION });
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
    if (candidates[activeSource]) return;

    let cancelled = false;
    setLoadingSource(activeSource);
    void getAiSyncCandidates(activeSource)
      .then((list) => {
        if (!cancelled) {
          setCandidates((prev) => ({ ...prev, [activeSource]: list }));
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingSource(null);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 仅随弹窗打开与 Tab 切换加载
  }, [open, activeSource]);

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

  const handleSelectionChange = (source: AiDataSource, keys: string[]) => {
    setSelection((prev) => ({ ...prev, [source]: keys }));
  };

  const handleConfirm = async () => {
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

  return {
    activeSource,
    setActiveSource,
    selection,
    keyword,
    setKeyword,
    syncResults,
    filteredList,
    totalSelected,
    loading: loadingSource === activeSource,
    handleSelectionChange,
    handleConfirm,
  };
}
