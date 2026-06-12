import { request } from './client';

/** 我的页概览数据 */
export interface MineOverview {
  /** 收藏数量 */
  collectCount: number;
  /** 已发布信息数量（含各审核状态） */
  publishCount: number;
  /** 待审核数量 */
  pendingCount: number;
  /** AI 历史会话数量 */
  aiSessionCount: number;
}

/** 查询我的页概览统计 */
export function queryMineOverview(): Promise<MineOverview> {
  return request<MineOverview>('/user/mine-overview');
}
