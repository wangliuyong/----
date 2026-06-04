import { Col, Row, Statistic } from 'antd';
import { AI_SOURCE_OPTIONS } from '../../../../api/ai.api';

export interface VectorStatsRowProps {
  stats: Record<string, number>;
}

/** 各数据源向量块数量统计 */
export default function VectorStatsRow({ stats }: VectorStatsRowProps) {
  return (
    <Row gutter={16} style={{ marginBottom: 24 }}>
      {AI_SOURCE_OPTIONS.map((opt) => (
        <Col span={6} key={opt.value}>
          <Statistic title={opt.label} value={stats[opt.value] ?? 0} suffix="块" />
        </Col>
      ))}
    </Row>
  );
}
