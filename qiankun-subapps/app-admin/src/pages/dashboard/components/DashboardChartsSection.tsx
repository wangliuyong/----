import { Card, Col, Row } from 'antd';
import type { DashboardOverview } from '../types';
import DashboardEChart from './charts/DashboardEChart';
import {
  buildContentMixOption,
  buildTopPagesOption,
  buildVisitTrendOption,
} from '../utils/chartOptions';

interface DashboardChartsSectionProps {
  charts: DashboardOverview['charts'];
}

/** 访问趋势与页面分布图表区 */
export default function DashboardChartsSection({ charts }: DashboardChartsSectionProps) {
  const trendOption = buildVisitTrendOption(charts.dailyTrend);
  const topPagesOption = buildTopPagesOption(charts.topPages);
  const contentMixOption = buildContentMixOption(charts.contentMix);

  return (
    <section className="dashboard-charts">
      <Row gutter={[16, 16]}>
        <Col xs={24} xl={16}>
          <Card
            bordered={false}
            className="dashboard-panel dashboard-chart-card"
            title="近 14 天访问与互动趋势"
          >
            <DashboardEChart option={trendOption} height={320} />
          </Card>
        </Col>
        <Col xs={24} xl={8}>
          <Card
            bordered={false}
            className="dashboard-panel dashboard-chart-card"
            title="站点内容构成"
          >
            <DashboardEChart option={contentMixOption} height={320} />
          </Card>
        </Col>
        <Col xs={24}>
          <Card
            bordered={false}
            className="dashboard-panel dashboard-chart-card"
            title="本周热门页面"
          >
            {charts.topPages.length > 0 ? (
              <DashboardEChart option={topPagesOption} height={Math.max(220, charts.topPages.length * 42)} />
            ) : (
              <div className="dashboard-chart__empty">暂无访问记录，浏览前台页面后将自动统计</div>
            )}
          </Card>
        </Col>
      </Row>
    </section>
  );
}
