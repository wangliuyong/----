/** 首页概览 API 响应（与 nest-server DashboardOverviewDto 对齐） */

export interface DashboardOverview {
  site: {
    siteName: string;
  };
  content: {
    articles: number;
    projects: number;
    links: number;
    messages: number;
    articlesThisMonth: number;
  };
  interaction: {
    messagesToday: number;
    messagesThisWeek: number;
    aiSessions: number;
    aiSessionsToday: number;
    aiSessionsThisWeek: number;
    aiMessages: number;
  };
  logs: {
    auditToday: number;
    appErrorsToday: number;
    appErrorsThisWeek: number;
  };
  server: {
    nodeVersion: string;
    platform: string;
    arch: string;
    hostname: string;
    uptimeSeconds: number;
    env: string;
    memory: {
      totalMb: number;
      freeMb: number;
      usedMb: number;
      rssMb: number;
    };
    databaseSizeBytes: number | null;
  };
  ai: {
    configured: boolean;
    lastSyncStatus: string | null;
    lastSyncAt: string | null;
    vectorChunkCount: number;
  };
  recent: {
    messages: Array<{
      id: number;
      nickname: string;
      content: string;
      createdAt: string;
    }>;
    articles: Array<{
      id: number;
      title: string;
      publishedAt: string;
    }>;
    auditLogs: Array<{
      id: number;
      username: string | null;
      action: string;
      module: string | null;
      createdAt: string;
    }>;
  };
}
