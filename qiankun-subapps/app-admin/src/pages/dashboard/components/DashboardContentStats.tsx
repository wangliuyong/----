import {
  BookOutlined,
  CommentOutlined,
  LinkOutlined,
  ProjectOutlined,
} from '@ant-design/icons';
import { Card, Col, Row, Statistic } from 'antd';
import type { DashboardOverview } from '../types';

interface DashboardContentStatsProps {
  content: DashboardOverview['content'];
}

/** 站点内容数量概览 */
export default function DashboardContentStats({ content }: DashboardContentStatsProps) {
  const items = [
    {
      key: 'articles',
      title: '博客文章',
      value: content.articles,
      suffix: `本月 +${content.articlesThisMonth}`,
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
    <Row gutter={[16, 16]}>
      {items.map((item) => (
        <Col key={item.key} xs={24} sm={12} lg={6}>
          <Card className="dashboard-stat-card" bordered={false}>
            <div className="dashboard-stat-card__icon">{item.icon}</div>
            <Statistic
              title={item.title}
              value={item.value}
              suffix={item.suffix}
              valueStyle={{ fontWeight: 600 }}
            />
          </Card>
        </Col>
      ))}
    </Row>
  );
}
