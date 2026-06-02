import { useWebQuery } from '../../../hooks/useWebQuery';
import { webApi } from '../../../utils/webApi';
import type { Project } from '../../../../../_shared/contentTypes';

/** 项目列表 */
export function useProjects() {
  const { data, loading, error } = useWebQuery<Project[]>(
    webApi.listProjects,
    '项目列表加载失败',
  );
  return { projects: data ?? [], loading, error };
}
