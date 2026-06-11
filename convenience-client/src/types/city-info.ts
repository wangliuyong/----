/** 审核状态 */
export type AuditStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

/** 分类节点（对齐 Category 表） */
export interface CategoryItem {
  id: number;
  parentId: number | null;
  name: string;
  sort: number;
  enabled: boolean;
  children?: CategoryItem[];
}

/** 轮播图（对齐 Banner 表） */
export interface BannerItem {
  id: number;
  imageUrl: string;
  linkUrl?: string;
  sort: number;
  online: boolean;
}

/** 公告（对齐 Notice 表） */
export interface NoticeItem {
  id: number;
  title: string;
  content: string;
  published: boolean;
  createdAt: string;
}

/** 便民信息（对齐 CityInfo 表） */
export interface CityInfoItem {
  id: number;
  userId: number;
  categoryId: number;
  categoryName?: string;
  title: string;
  content: string;
  price?: number;
  address?: string;
  latitude?: number;
  longitude?: number;
  images: string[];
  auditStatus: AuditStatus;
  viewCount: number;
  collectCount: number;
  createdAt: string;
  /** 前端计算：距当前用户距离（km） */
  distanceKm?: number;
  /** 当前用户是否已收藏 */
  collected?: boolean;
}

/** 便民信息列表查询 */
export interface CityInfoQuery {
  page?: number;
  pageSize?: number;
  categoryId?: number;
  keyword?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'latest' | 'distance' | 'price';
}

/** 发布/编辑便民信息 */
export interface CityInfoPayload {
  categoryId: number;
  title: string;
  content: string;
  price?: number;
  address?: string;
  latitude?: number;
  longitude?: number;
  images?: string[];
}

/** 收藏记录（对齐 Collect 表） */
export interface CollectItem {
  id: number;
  userId: number;
  infoId: number;
  createdAt: string;
  info?: CityInfoItem;
}

/** 举报类型 */
export type ReportType = 'SPAM' | 'FRAUD' | 'ILLEGAL' | 'OTHER';

/** 举报记录（对齐 Report 表） */
export interface ReportPayload {
  infoId: number;
  reportType: ReportType;
  content: string;
}

/** AI 会话（对齐 AiSession 表） */
export interface AiSessionItem {
  id: number;
  userId: number;
  title: string;
  createdAt: string;
}

/** AI 消息角色 */
export type AiMessageRole = 'user' | 'assistant';

/** AI 消息（对齐 AiMessage 表） */
export interface AiMessageItem {
  id: number;
  sessionId: number;
  role: AiMessageRole;
  content: string;
  createdAt: string;
}

/** AI 问答请求 */
export interface AiChatPayload {
  sessionId?: number;
  question: string;
}

/** AI 问答响应（非流式兜底） */
export interface AiChatResult {
  sessionId: number;
  answer: string;
}
