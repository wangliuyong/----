import { Card, Col, Row, Statistic } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import PageLoading from '../../../components/_common/PageLoading';
import { queryConvDashboardOverview } from '../../../api/convenience.api';
import type { ConvDashboardOverview } from '../../../types/convenience';

/** 路由 convenience/dashboard — 便民业务概览 */
export default function ConvDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ConvDashboardOverview | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setData(await queryConvDashboardOverview());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading && !data) return <PageLoading />;

  return (
    <Card title="便民业务概览">
      <Row gutter={[16, 16]}>
        <Col xs={12} md={8} lg={6}>
          <Statistic title="待审核信息" value={data?.pendingAuditCount ?? 0} valueStyle={{ color: '#d97706' }} />
        </Col>
        <Col xs={12} md={8} lg={6}>
          <Statistic title="已通过信息" value={data?.approvedInfoCount ?? 0} />
        </Col>
        <Col xs={12} md={8} lg={6}>
          <Statistic title="已驳回信息" value={data?.rejectedInfoCount ?? 0} />
        </Col>
        <Col xs={12} md={8} lg={6}>
          <Statistic title="C端用户数" value={data?.userCount ?? 0} />
        </Col>
        <Col xs={12} md={8} lg={6}>
          <Statistic title="举报记录" value={data?.reportCount ?? 0} />
        </Col>
        <Col xs={12} md={8} lg={6}>
          <Statistic title="公告数" value={data?.noticeCount ?? 0} />
        </Col>
        <Col xs={12} md={8} lg={6}>
          <Statistic title="在线轮播" value={data?.bannerCount ?? 0} />
        </Col>
      </Row>
    </Card>
  );
}
