import type { Project } from '../../types';

/** /admin/projects 页面入参 */
export interface ProjectsPageProps {
  apiBase: string;
  projects: Project[];
  onRefresh: () => void;
}
