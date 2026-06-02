import { ProjectsPanel } from '../../components/AdminPanels';
import type { ProjectsPageProps } from './types';

/** /admin/projects — 项目 CRUD */
export default function ProjectsPage({ apiBase, projects, onRefresh }: ProjectsPageProps) {
  return <ProjectsPanel apiBase={apiBase} projects={projects} onRefresh={onRefresh} />;
}
