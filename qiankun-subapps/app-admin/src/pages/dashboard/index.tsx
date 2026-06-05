import { ReloadOutlined } from '@ant-design/icons';
import { Button, Col, Row, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import PageLoading from '../../components/_common/PageLoading';
import DashboardChartsSection from './components/DashboardChartsSection';
import DashboardContentStats from './components/DashboardContentStats';
import DashboardInteractionPanel from './components/DashboardInteractionPanel';
import DashboardQuickLinks from './components/DashboardQuickLinks';
import DashboardRecentPanel from './components/DashboardRecentPanel';
import DashboardServerPanel from './components/DashboardServerPanel';
import DashboardVisitRecordsPanel from './components/DashboardVisitRecordsPanel';
import { useDashboardOverview } from './hooks/useDashboardOverview';
import './styles/dashboard.scss';

/** 路由 dashboard — 管理后台首页概览 */
export default function DashboardPage() {
  const navigate = useNavigate();
  const { overview, loading, reload } = useDashboardOverview();

  if (loading || !overview) {
    return <PageLoading />;
  }

  return (
    <div className="dashboard-page">
      <header className="dashboard-hero">
        <div className="dashboard-hero__copy">
          <Typography.Title level={3} className="dashboard-hero__title">
            {overview.site.siteName}
          </Typography.Title>
          <p className="dashboard-hero__subtitle">
            app-web 访问、内容概况与服务器状态一屏掌握
          </p>
        </div>
        <Button icon={<ReloadOutlined />} onClick={() => void reload()}>
          刷新数据
        </Button>
      </header>

      <DashboardContentStats content={overview.content} visit={overview.visit} />

      <DashboardChartsSection charts={overview.charts} />

      <DashboardVisitRecordsPanel records={overview.recentPageViews} />

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <DashboardInteractionPanel
            interaction={overview.interaction}
            logs={overview.logs}
            messagesTotal={overview.content.messages}
          />
        </Col>
        <Col xs={24} lg={10}>
          <DashboardServerPanel server={overview.server} ai={overview.ai} />
        </Col>
      </Row>

      <DashboardQuickLinks onNavigate={(path) => navigate(`/${path}`)} />

      <DashboardRecentPanel recent={overview.recent} />
    </div>
  );
}
