import { Form, Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import AdminCrudPage from '../../components/AdminCrudPage';
import { useApiBase } from '../../context/ApiBaseContext';
import { adminApi } from '../../utils/adminApi';
import type { Project } from '../../types';
import { useProjects } from './useProjects';

const { TextArea } = Input;

const columns: ColumnsType<Project> = [
  { title: '项目名称', dataIndex: 'name', width: 180 },
  { title: '描述', dataIndex: 'desc', ellipsis: true },
  { title: '技术栈', dataIndex: 'techStack', width: 140 },
];

/** 路由 /projects — 项目 CRUD */
export default function ProjectsPage() {
  const apiBase = useApiBase();
  const { projects, loading, error, reload } = useProjects();

  return (
    <AdminCrudPage<Project>
      title="项目管理"
      createLabel="新建项目"
      data={projects}
      loading={loading}
      error={error}
      columns={columns}
      deleteConfirmTitle="确定删除该项目？"
      modalTitles={{ create: '新建项目', edit: '编辑项目' }}
      onCreate={(values) => adminApi.createProject(apiBase, values)}
      onUpdate={(id, values) => adminApi.updateProject(apiBase, id, values)}
      onDelete={(id) => adminApi.deleteProject(apiBase, id)}
      onReload={reload}
      renderForm={() => (
        <>
          <Form.Item name="name" label="项目名称" rules={[{ required: true, message: '请输入名称' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="desc" label="项目描述" rules={[{ required: true, message: '请输入描述' }]}>
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item name="techStack" label="技术栈">
            <Input placeholder="React, NestJS, Docker..." />
          </Form.Item>
          <Form.Item name="githubUrl" label="GitHub URL">
            <Input />
          </Form.Item>
          <Form.Item name="previewUrl" label="预览 URL">
            <Input />
          </Form.Item>
        </>
      )}
    />
  );
}
