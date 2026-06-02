import { listProjects } from '../../api/projects.api';
import { useAdminQuery } from '../../hooks/useAdminQuery';
import type { Project } from '../../types';

/** 项目列表数据 */
export function useProjects() {
  const { data, loading, reload } = useAdminQuery<Project[]>(listProjects);
  return { projects: data ?? [], loading, reload };
}
