import { useCallback, useEffect, useState } from 'react';
import type { Project } from '../types';
import { adminApi } from '../utils/adminApi';
import { useApiBase } from '../context/ApiBaseContext';

/** 项目列表页数据 */
export function useProjects() {
  const apiBase = useApiBase();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setProjects(await adminApi.listProjects(apiBase));
    } catch (e) {
      setError(e instanceof Error ? e.message : '加载失败');
    } finally {
      setLoading(false);
    }
  }, [apiBase]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { projects, loading, error, reload };
}
