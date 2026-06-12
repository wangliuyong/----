import {
  postConvCategoryCreate,
  postConvCategoryDelete,
  postConvCategoryUpdate,
  queryConvCategoryList,
} from '../../../api/convenience.api';
import AdminCrudPage from '../../../components/AdminCrudPage';
import { useAdminQuery } from '../../../hooks/useAdminQuery';
import type { ConvCategoryItem } from '../../../types/convenience';
import ConvCategoryFormFields, { CONV_CATEGORY_COLUMNS } from './components/CategoryFormFields';

/** 路由 convenience/categories — 分类管理 */
export default function ConvCategoriesPage() {
  const { data, loading, reload } = useAdminQuery(queryConvCategoryList);

  return (
    <AdminCrudPage<ConvCategoryItem>
      title="分类管理"
      createLabel="新建分类"
      data={data ?? []}
      loading={loading}
      createPermission="admin:conv:categories:create"
      updatePermission="admin:conv:categories:update"
      deletePermission="admin:conv:categories:delete"
      columns={CONV_CATEGORY_COLUMNS}
      deleteConfirmTitle="确定删除该分类？"
      modalTitles={{ create: '新建分类', edit: '编辑分类' }}
      onCreate={(values) => postConvCategoryCreate(values as ConvCategoryItem & { id: number })}
      onUpdate={(id, values) => postConvCategoryUpdate(id, values)}
      onDelete={(id) => postConvCategoryDelete(id)}
      onReload={reload}
      renderForm={(form) => (
        <ConvCategoryFormFields form={form} categories={data ?? []} />
      )}
    />
  );
}
