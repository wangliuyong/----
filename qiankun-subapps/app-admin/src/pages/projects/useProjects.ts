import { listProjects } from '../../api/projects.api';
import { useAdminQuery } from '../../hooks/useAdminQuery';
import type { Project } from '../../types';

/** 项目列表数据 */
export function useProjects() {
  const { data, loading, error, reload } = useAdminQuery<Project[]>(listProjects);
  return { projects: data ?? [], loading, error, reload };
}
