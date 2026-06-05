import { ReloadOutlined } from '@ant-design/icons';
import { Button, Col, Row, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import PageLoading from '../../components/_common/PageLoading';
import DashboardContentStats from './components/DashboardContentStats';
import DashboardInteractionPanel from './components/DashboardInteractionPanel';
import DashboardQuickLinks from './components/DashboardQuickLinks';
import DashboardRecentPanel from './components/DashboardRecentPanel';
import DashboardServerPanel from './components/DashboardServerPanel';
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
      <div className="dashboard-page__header">
        <div>
          <Typography.Title level={3} className="dashboard-page__title">
            {overview.site.siteName}
          </Typography.Title>
          <p className="dashboard-page__subtitle">站点运行概览与常用管理入口</p>
        </div>
        <Button icon={<ReloadOutlined />} onClick={() => void reload()}>
          刷新
        </Button>
      </div>

      <DashboardContentStats content={overview.content} />

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
