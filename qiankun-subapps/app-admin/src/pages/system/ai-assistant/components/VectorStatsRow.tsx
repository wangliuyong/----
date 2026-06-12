import { Col, Row } from 'antd';
import { AI_SOURCE_OPTIONS } from '../../../../api/ai.api';

export interface VectorStatsRowProps {
  stats: Record<string, number>;
}

/** 各数据源向量块数量统计（细分 breakdown） */
export default function VectorStatsRow({ stats }: VectorStatsRowProps) {
  return (
    <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
      {AI_SOURCE_OPTIONS.map((opt) => (
        <Col xs={12} sm={8} md={6} key={opt.value}>
          <div className="admin-stat-card admin-stat-card--default">
            <div className="admin-stat-card__body">
              <span className="admin-stat-card__label">{opt.label}</span>
              <span className="admin-stat-card__value">{stats[opt.value] ?? 0}</span>
              <span className="admin-stat-card__hint">向量块</span>
            </div>
          </div>
        </Col>
      ))}
    </Row>
  );
}
