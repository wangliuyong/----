import { Col, Row } from 'antd';
import type { DashboardSectionId } from '../config/sectionTypes';
import type { DashboardOverview } from '../types';
import DashboardChartsSection from './DashboardChartsSection';
import DashboardContentStats from './DashboardContentStats';
import DashboardInteractionPanel from './DashboardInteractionPanel';
import DashboardQuickLinks from './DashboardQuickLinks';
import DashboardRecentPanel from './DashboardRecentPanel';
import DashboardServerPanel from './DashboardServerPanel';
import DashboardVisitRecordsPanel from './DashboardVisitRecordsPanel';

interface DashboardSectionRendererProps {
  sectionId: DashboardSectionId;
  overview: DashboardOverview;
  onNavigate: (path: string) => void;
}

/** 按区块 id 渲染对应首页卡片内容（纯展示，不含拖拽逻辑） */
export default function DashboardSectionRenderer({
  sectionId,
  overview,
  onNavigate,
}: DashboardSectionRendererProps) {
  switch (sectionId) {
    case 'stats':
      return (
        <DashboardContentStats content={overview.content} visit={overview.visit} />
      );

    case 'charts':
      return <DashboardChartsSection charts={overview.charts} />;

    case 'visits':
      return <DashboardVisitRecordsPanel records={overview.recentPageViews} />;

    case 'panels':
      return (
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
      );

    case 'quickLinks':
      return <DashboardQuickLinks onNavigate={onNavigate} />;

    case 'recent':
      return <DashboardRecentPanel recent={overview.recent} />;

    default:
      return null;
  }
}
