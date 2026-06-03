import { Document } from '@langchain/core/documents';
import type { AdminAuditLog, AppLog } from '@prisma/client';

/** 将审计日志与应用运行日志转为 Document */
export function loadSystemLogs(
  auditLogs: AdminAuditLog[],
  appLogs: AppLog[],
): Document[] {
  const auditDocs = auditLogs.map((log) => {
    const time = log.createdAt.toISOString();
    const user = log.username ?? (log.userId ? `user#${log.userId}` : '未知用户');
    const content = `[审计] 用户 ${user} 于 ${time} 执行 ${log.action}（模块：${log.module ?? '-'}${log.targetId ? `，目标：${log.targetId}` : ''}）${log.detail ? `，详情：${log.detail}` : ''}`;

    return new Document({
      pageContent: content,
      metadata: {
        source: 'logs',
        sourceId: `audit-${log.id}`,
        title: `审计-${log.action}`,
        logType: 'audit',
      },
    });
  });

  const appDocs = appLogs.map((log) => {
    const time = log.createdAt.toISOString();
    const content = `[运行] ${log.level.toUpperCase()} ${log.context ? `${log.context}: ` : ''}${log.message}${log.stack ? `\n${log.stack}` : ''}（${time}）`;

    return new Document({
      pageContent: content,
      metadata: {
        source: 'logs',
        sourceId: `app-${log.id}`,
        title: `运行-${log.level}`,
        logType: 'app',
      },
    });
  });

  return [...auditDocs, ...appDocs];
}
