import {
  AI_SOURCE_OPTIONS,
  type AiSyncRecordItem,
} from '../../../../api/ai.api';

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
