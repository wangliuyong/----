import { List, Typography } from 'antd';
import dayjs from 'dayjs';
import type { DashboardOverview } from '../types';
import { truncateText } from '../utils/formatters';

interface DashboardRecentPanelProps {
  recent: DashboardOverview['recent'];
}

/** 最近留言、文章与审计动态 */
export default function DashboardRecentPanel({ recent }: DashboardRecentPanelProps) {
  return (
    <div className="dashboard-recent-grid">
      <div className="dashboard-recent-block">
        <Typography.Title level={5}>最新留言</Typography.Title>
        <List
          size="small"
          dataSource={recent.messages}
          locale={{ emptyText: '暂无留言' }}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={`${item.nickname}`}
                description={
                  <>
                    <div>{truncateText(item.content, 56)}</div>
                    <span className="dashboard-muted">
                      {dayjs(item.createdAt).format('YYYY-MM-DD HH:mm')}
                    </span>
                  </>
                }
              />
            </List.Item>
          )}
        />
      </div>

      <div className="dashboard-recent-block">
        <Typography.Title level={5}>最新文章</Typography.Title>
        <List
          size="small"
          dataSource={recent.articles}
          locale={{ emptyText: '暂无文章' }}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={item.title}
                description={
                  <span className="dashboard-muted">
                    {dayjs(item.publishedAt).format('YYYY-MM-DD HH:mm')}
                  </span>
                }
              />
            </List.Item>
          )}
        />
      </div>

      <div className="dashboard-recent-block">
        <Typography.Title level={5}>最近操作</Typography.Title>
        <List
          size="small"
          dataSource={recent.auditLogs}
          locale={{ emptyText: '暂无审计记录' }}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={`${item.username ?? '系统'} - ${item.action}`}
                description={
                  <>
                    {item.module && <span>{item.module} </span>}
                    <span className="dashboard-muted">
                      {dayjs(item.createdAt).format('YYYY-MM-DD HH:mm')}
                    </span>
                  </>
                }
              />
            </List.Item>
          )}
        />
      </div>
    </div>
  );
}
