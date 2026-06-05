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
  visit: {
    today: number;
    week: number;
    total: number;
  };
  interaction: {
    messagesToday: number;
    messagesYesterday: number;
    messagesThisWeek: number;
    aiSessions: number;
    aiSessionsToday: number;
    aiSessionsThisWeek: number;
    aiMessages: number;
    aiAvgMessagesPerSession: number | null;
    pageViewsToday: number;
    pageViewsYesterday: number;
    pageViewsThisWeek: number;
    latestMessage: {
      nickname: string;
      content: string;
      createdAt: string;
    } | null;
    topPageThisWeek: {
      path: string;
      views: number;
    } | null;
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
  charts: {
    dailyTrend: Array<{
      date: string;
      label: string;
      pageViews: number;
      messages: number;
      aiSessions: number;
    }>;
    topPages: Array<{ path: string; views: number }>;
    contentMix: {
      articles: number;
      projects: number;
      links: number;
    };
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
  /** 最近 app-web 页面访问（含 IP、浏览器、地区） */
  recentPageViews: Array<{
    id: number;
    path: string;
    ip: string | null;
    browser: string | null;
    os: string | null;
    device: string | null;
    locale: string | null;
    timezone: string | null;
    region: string | null;
    createdAt: string;
  }>;
}
