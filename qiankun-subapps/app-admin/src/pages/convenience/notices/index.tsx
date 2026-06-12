import {
  postConvNoticeCreate,
  postConvNoticeDelete,
  postConvNoticeUpdate,
  queryConvNoticeList,
} from '../../../api/convenience.api';
import AdminCrudPage from '../../../components/AdminCrudPage';
import { useAdminQuery } from '../../../hooks/useAdminQuery';
import ConvNoticeFormFields, { CONV_NOTICE_COLUMNS } from './components/NoticeFormFields';
import type { ConvNoticeItem } from '../../../types/convenience';

/** 路由 convenience/notices — 公告管理 */
export default function ConvNoticesPage() {
  const { data, loading, reload } = useAdminQuery(queryConvNoticeList);

  return (
    <AdminCrudPage<ConvNoticeItem>
      title="公告管理"
      description="发布至便民小程序的系统公告与通知"
      createLabel="新建公告"
      data={data ?? []}
      loading={loading}
      createPermission="admin:conv:notices:create"
      updatePermission="admin:conv:notices:update"
      deletePermission="admin:conv:notices:delete"
      columns={CONV_NOTICE_COLUMNS}
      deleteConfirmTitle="确定删除该公告？"
      modalTitles={{ create: '新建公告', edit: '编辑公告' }}
      modalWidth={640}
      onCreate={(values) => postConvNoticeCreate(values)}
      onUpdate={(id, values) => postConvNoticeUpdate(id, values)}
      onDelete={(id) => postConvNoticeDelete(id)}
      onReload={reload}
      renderForm={() => <ConvNoticeFormFields />}
    />
  );
}
