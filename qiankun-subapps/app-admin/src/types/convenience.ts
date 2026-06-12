/** 便民业务分页结果 */
export interface ConvPageResult<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

export type ConvAuditStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

/** 便民信息（管理端） */
export interface ConvCityInfoItem {
  id: number;
  userId: number;
  userNickname?: string;
  userPhone?: string;
  categoryId: number;
  categoryName?: string;
  title: string;
  content: string;
  price?: number;
  address?: string;
  images: string[];
  auditStatus: ConvAuditStatus;
  viewCount: number;
  collectCount: number;
  createdAt: string;
}

export interface ConvCityInfoQuery {
  page?: number;
  pageSize?: number;
  auditStatus?: ConvAuditStatus;
  keyword?: string;
  categoryId?: number;
}

/** C 端用户（管理端） */
export interface ConvUserItem {
  id: number;
  phone?: string;
  nickname: string;
  avatar?: string;
  userType: 'USER' | 'MERCHANT' | 'ADMIN';
  status: 'ACTIVE' | 'DISABLED';
  createdAt: string;
  publishCount?: number;
  pendingCount?: number;
}

export interface ConvUserQuery {
  page?: number;
  pageSize?: number;
  keyword?: string;
  userType?: 'USER' | 'MERCHANT' | 'ADMIN';
  status?: 'ACTIVE' | 'DISABLED';
}

/** 分类 */
export interface ConvCategoryItem {
  id: number;
  parentId: number | null;
  name: string;
  sort: number;
  enabled: boolean;
  children?: ConvCategoryItem[];
}

/** 轮播图 */
export interface ConvBannerItem {
  id: number;
  imageUrl: string;
  linkUrl?: string;
  sort: number;
  online: boolean;
}

/** 公告 */
export interface ConvNoticeItem {
  id: number;
  title: string;
  content: string;
  published: boolean;
  createdAt: string;
}

/** 举报 */
export interface ConvReportItem {
  id: number;
  userId: number;
  userNickname: string;
  infoId: number;
  infoTitle: string;
  infoAuditStatus: string;
  reportType: string;
  content: string;
  createdAt: string;
}

export interface ConvReportQuery {
  page?: number;
  pageSize?: number;
  reportType?: 'SPAM' | 'FRAUD' | 'ILLEGAL' | 'OTHER';
}

/** 业务概览 */
export interface ConvDashboardOverview {
  pendingAuditCount: number;
  approvedInfoCount: number;
  rejectedInfoCount: number;
  userCount: number;
  reportCount: number;
  noticeCount: number;
  bannerCount: number;
}
