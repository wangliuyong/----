import { request } from './client';
import type {
  ConvBannerItem,
  ConvCategoryItem,
  ConvCityInfoItem,
  ConvCityInfoQuery,
  ConvDashboardOverview,
  ConvNoticeItem,
  ConvPageResult,
  ConvReportItem,
  ConvReportQuery,
  ConvUserItem,
  ConvUserQuery,
} from '../types/convenience';

/** 查询便民业务概览 */
export function queryConvDashboardOverview() {
  return request<ConvDashboardOverview>('/admin/convenience/dashboard/overview');
}

/** 分页查询便民信息 */
export function queryConvCityInfoList(params: ConvCityInfoQuery) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== '') qs.set(k, String(v));
  });
  const q = qs.toString();
  return request<ConvPageResult<ConvCityInfoItem>>(
    `/admin/convenience/city-info${q ? `?${q}` : ''}`,
  );
}

/** 查询便民信息详情 */
export function queryConvCityInfoDetail(id: number) {
  return request<ConvCityInfoItem>(`/admin/convenience/city-info/${id}`);
}

/** 审核便民信息 */
export function postConvCityInfoAudit(id: number, auditStatus: 'APPROVED' | 'REJECTED') {
  return request<ConvCityInfoItem>(`/admin/convenience/city-info/${id}/audit`, {
    method: 'PUT',
    body: JSON.stringify({ auditStatus }),
  });
}

/** 删除便民信息 */
export function postConvCityInfoDelete(id: number) {
  return request<void>(`/admin/convenience/city-info/${id}`, { method: 'DELETE' });
}

/** 查询分类扁平列表 */
export function queryConvCategoryList() {
  return request<ConvCategoryItem[]>('/admin/convenience/categories');
}

/** 创建分类 */
export function postConvCategoryCreate(data: Partial<ConvCategoryItem> & { id: number }) {
  return request<ConvCategoryItem>('/admin/convenience/categories', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/** 更新分类 */
export function postConvCategoryUpdate(id: number, data: Partial<ConvCategoryItem>) {
  return request<ConvCategoryItem>(`/admin/convenience/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/** 删除分类 */
export function postConvCategoryDelete(id: number) {
  return request<void>(`/admin/convenience/categories/${id}`, { method: 'DELETE' });
}

/** 查询轮播图列表 */
export function queryConvBannerList() {
  return request<ConvBannerItem[]>('/admin/convenience/banners');
}

/** 创建轮播图 */
export function postConvBannerCreate(data: Partial<ConvBannerItem>) {
  return request<ConvBannerItem>('/admin/convenience/banners', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/** 更新轮播图 */
export function postConvBannerUpdate(id: number, data: Partial<ConvBannerItem>) {
  return request<ConvBannerItem>(`/admin/convenience/banners/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/** 删除轮播图 */
export function postConvBannerDelete(id: number) {
  return request<void>(`/admin/convenience/banners/${id}`, { method: 'DELETE' });
}

/** 查询公告列表 */
export function queryConvNoticeList() {
  return request<ConvNoticeItem[]>('/admin/convenience/notices');
}

/** 创建公告 */
export function postConvNoticeCreate(data: Partial<ConvNoticeItem>) {
  return request<ConvNoticeItem>('/admin/convenience/notices', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/** 更新公告 */
export function postConvNoticeUpdate(id: number, data: Partial<ConvNoticeItem>) {
  return request<ConvNoticeItem>(`/admin/convenience/notices/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/** 删除公告 */
export function postConvNoticeDelete(id: number) {
  return request<void>(`/admin/convenience/notices/${id}`, { method: 'DELETE' });
}

/** 分页查询 C 端用户 */
export function queryConvUserList(params: ConvUserQuery) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== '') qs.set(k, String(v));
  });
  const q = qs.toString();
  return request<ConvPageResult<ConvUserItem>>(
    `/admin/convenience/users${q ? `?${q}` : ''}`,
  );
}

/** 更新 C 端用户 */
export function postConvUserUpdate(
  id: number,
  data: Pick<ConvUserItem, 'nickname' | 'userType' | 'status'>,
) {
  return request<ConvUserItem>(`/admin/convenience/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/** 重置 C 端用户密码 */
export function postConvUserResetPassword(id: number, password: string) {
  return request<{ ok: boolean }>(`/admin/convenience/users/${id}/reset-password`, {
    method: 'PUT',
    body: JSON.stringify({ password }),
  });
}

/** 分页查询举报 */
export function queryConvReportList(params: ConvReportQuery) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== '') qs.set(k, String(v));
  });
  const q = qs.toString();
  return request<ConvPageResult<ConvReportItem>>(
    `/admin/convenience/reports${q ? `?${q}` : ''}`,
  );
}

/** 删除举报记录 */
export function postConvReportDelete(id: number) {
  return request<void>(`/admin/convenience/reports/${id}`, { method: 'DELETE' });
}
