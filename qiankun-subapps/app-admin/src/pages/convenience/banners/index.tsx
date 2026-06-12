import {
  postConvBannerCreate,
  postConvBannerDelete,
  postConvBannerUpdate,
  queryConvBannerList,
} from '../../../api/convenience.api';
import AdminCrudPage from '../../../components/AdminCrudPage';
import { useAdminQuery } from '../../../hooks/useAdminQuery';
import BannerFormFields, { CONV_BANNER_COLUMNS } from './components/BannerFormFields';
import type { ConvBannerItem } from '../../../types/convenience';

/** 路由 convenience/banners — 轮播图管理 */
export default function ConvBannersPage() {
  const { data, loading, reload } = useAdminQuery(queryConvBannerList);

  return (
    <AdminCrudPage<ConvBannerItem>
      title="轮播图管理"
      createLabel="新建轮播图"
      data={data ?? []}
      loading={loading}
      createPermission="admin:conv:banners:create"
      updatePermission="admin:conv:banners:update"
      deletePermission="admin:conv:banners:delete"
      columns={CONV_BANNER_COLUMNS}
      deleteConfirmTitle="确定删除该轮播图？"
      modalTitles={{ create: '新建轮播图', edit: '编辑轮播图' }}
      onCreate={(values) => postConvBannerCreate(values)}
      onUpdate={(id, values) => postConvBannerUpdate(id, values)}
      onDelete={(id) => postConvBannerDelete(id)}
      onReload={reload}
      renderForm={() => <BannerFormFields />}
    />
  );
}
