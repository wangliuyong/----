import { createProject, deleteProject, updateProject } from '../../api/projects.api';
import AdminCrudPage from '../../components/AdminCrudPage';
import type { Project } from '../../types';
import ProjectFormFields from './components/ProjectFormFields';
import { PROJECT_COLUMNS } from './components/projectColumns';
import { useProjects } from './useProjects';

/** 路由 projects — 项目 CRUD */
export default function ProjectsPage() {
  const { projects, loading, reload } = useProjects();

  return (
    <AdminCrudPage<Project>
      title="项目管理"
      description="展示在首页的项目作品集，含技术栈与预览链接"
      createLabel="新建项目"
      data={projects}
      loading={loading}
      createPermission="admin:projects:create"
      updatePermission="admin:projects:update"
      deletePermission="admin:projects:delete"
      columns={PROJECT_COLUMNS}
      deleteConfirmTitle="确定删除该项目？"
      modalTitles={{ create: '新建项目', edit: '编辑项目' }}
      onCreate={(values) => createProject(values)}
      onUpdate={(id, values) => updateProject(id, values)}
      onDelete={(id) => deleteProject(id)}
      onReload={reload}
      renderForm={() => <ProjectFormFields />}
    />
  );
}
