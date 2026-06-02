import { ProjectsPanel } from '../../components/AdminPanels';
import PageError from '../../components/PageError';
import { useProjects } from '../../hooks/useProjects';
import PageLoading from '../_common/PageLoading';
import { useApiBase } from '../../context/ApiBaseContext';

/** 路由 /projects — 项目 CRUD */
export default function ProjectsPage() {
  const apiBase = useApiBase();
  const { projects, loading, error, reload } = useProjects();

  if (loading) return <PageLoading />;

  return (
    <>
      <PageError message={error} />
      <ProjectsPanel apiBase={apiBase} projects={projects} onRefresh={reload} />
    </>
  );
}
