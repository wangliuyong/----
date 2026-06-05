import {
  BookOutlined,
  CommentOutlined,
  EyeOutlined,
  LinkOutlined,
  ProjectOutlined,
} from '@ant-design/icons';
import { Statistic } from 'antd';
import type { DashboardOverview } from '../types';

interface DashboardContentStatsProps {
  content: DashboardOverview['content'];
  visit: DashboardOverview['visit'];
}

/** 站点核心指标卡片 */
export default function DashboardContentStats({ content, visit }: DashboardContentStatsProps) {
  const items = [
    {
      key: 'pv-today',
      title: '今日访问 (PV)',
      value: visit.today,
      icon: <EyeOutlined />,
      accent: true,
    },
    {
      key: 'pv-week',
      title: '本周访问',
      value: visit.week,
      icon: <EyeOutlined />,
    },
    {
      key: 'articles',
      title: '博客文章',
      value: content.articles,
      suffix: content.articlesThisMonth > 0 ? `本月 +${content.articlesThisMonth}` : undefined,
      icon: <BookOutlined />,
    },
    {
      key: 'projects',
      title: '项目作品',
      value: content.projects,
      icon: <ProjectOutlined />,
    },
    {
      key: 'links',
      title: '友情链接',
      value: content.links,
      icon: <LinkOutlined />,
    },
    {
      key: 'messages',
      title: '访客留言',
      value: content.messages,
      icon: <CommentOutlined />,
    },
  ];

  return (
    <div className="dashboard-stats-grid">
      {items.map((item) => (
        <div
          key={item.key}
          className={`dashboard-stat-card${item.accent ? ' dashboard-stat-card--accent' : ''}`}
        >
          <div className="dashboard-stat-card__icon">{item.icon}</div>
          <Statistic
            title={item.title}
            value={item.value}
            suffix={item.suffix}
            valueStyle={{ fontWeight: 600, fontSize: 28 }}
          />
        </div>
      ))}
    </div>
  );
}
