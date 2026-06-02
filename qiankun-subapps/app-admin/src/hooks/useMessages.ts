import { useCallback, useEffect, useState } from 'react';
import type { Message } from '../types';
import { adminApi } from '../utils/adminApi';
import { useApiBase } from '../context/ApiBaseContext';

/** 留言列表页数据 */
export function useMessages() {
  const apiBase = useApiBase();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setMessages(await adminApi.listMessages(apiBase));
    } catch (e) {
      setError(e instanceof Error ? e.message : '加载失败');
    } finally {
      setLoading(false);
    }
  }, [apiBase]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { messages, loading, error, reload };
}
