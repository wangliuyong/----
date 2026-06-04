import { createLink, deleteLink, updateLink } from '../../api/links.api';
import AdminCrudPage from '../../components/AdminCrudPage';
import type { LinkItem } from '../../types';
import LinkFormFields from './components/LinkFormFields';
import { LINK_COLUMNS } from './components/linkColumns';
import { useLinks } from './useLinks';

/** 路由 links — 友链 CRUD */
export default function LinksPage() {
  const { links, loading, reload } = useLinks();

  return (
    <AdminCrudPage<LinkItem>
      title="友链管理"
      createLabel="新建友链"
      data={links}
      loading={loading}
      createPermission="admin:links:create"
      updatePermission="admin:links:update"
      deletePermission="admin:links:delete"
      columns={LINK_COLUMNS}
      deleteConfirmTitle="确定删除该友链？"
      modalTitles={{ create: '新建友链', edit: '编辑友链' }}
      onCreate={(values) => createLink(values)}
      onUpdate={(id, values) => updateLink(id, values)}
      onDelete={(id) => deleteLink(id)}
      onReload={reload}
      renderForm={() => <LinkFormFields />}
    />
  );
}
