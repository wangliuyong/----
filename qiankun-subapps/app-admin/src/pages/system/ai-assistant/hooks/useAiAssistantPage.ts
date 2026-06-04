import { useCallback, useEffect, useState } from 'react';
import { getAiStats, getAiSyncStatus, type AiSyncRecord } from '../../../../api/ai.api';

/**
 * 数据配置管理页：向量统计 + 最近同步记录。
 */
export function useAiAssistantPage() {
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<AiSyncRecord[]>([]);
  const [stats, setStats] = useState<Record<string, number>>({});

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [statusData, statsData] = await Promise.all([getAiSyncStatus(), getAiStats()]);
      setRecords(statusData);
      setStats(statsData.vectorStats);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  return { loading, records, stats, loadData };
}
