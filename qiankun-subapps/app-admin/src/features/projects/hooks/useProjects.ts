import { useAdminQuery } from '../../../hooks/useAdminQuery';
import { adminApi } from '../../../utils/adminApi';
import type { Project } from '../../../types';

/** 项目列表数据 */
export function useProjects() {
  const { data, loading, error, reload } = useAdminQuery<Project[]>(adminApi.listProjects);
  return { projects: data ?? [], loading, error, reload };
}
