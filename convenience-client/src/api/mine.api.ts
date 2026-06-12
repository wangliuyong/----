import { queryAiSessions } from '@/api/ai.api';
import { queryCollectList } from '@/api/collect.api';
import { queryMyCityInfoList } from '@/api/city-info.api';
import { mockState, mockDelay } from '@/mock/data';
import { useMock } from '@/utils/platform';

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

/**
 * 查询我的页概览统计
 * 聚合收藏、发布、AI 会话等核心数字，供「我的」Tab 一眼展示
 */
export async function queryMineOverview(): Promise<MineOverview> {
  if (useMock()) {
    await mockDelay(150);
    const userId = 1;
    const myPosts = mockState.cityInfoList.filter((i) => i.userId === userId);
    return {
      collectCount: mockState.collectList.length,
      publishCount: myPosts.length,
      pendingCount: myPosts.filter((i) => i.auditStatus === 'PENDING').length,
      aiSessionCount: mockState.aiSessions.length,
    };
  }

  const [collectRes, publishRes, sessions] = await Promise.all([
    queryCollectList(1, 1),
    queryMyCityInfoList(1, 1),
    queryAiSessions(),
  ]);

  return {
    collectCount: collectRes.total,
    publishCount: publishRes.total,
    pendingCount: publishRes.list.filter((i) => i.auditStatus === 'PENDING').length,
    aiSessionCount: sessions.length,
  };
}
