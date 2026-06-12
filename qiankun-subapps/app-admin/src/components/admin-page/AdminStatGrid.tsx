import { Col, Row } from 'antd';
import type { AdminStatItem } from './types';

export interface AdminStatGridProps {
  items: AdminStatItem[];
}

/**
 * 页面顶部统计指标网格
 * 自适应列数：移动端 2 列，平板 3 列，桌面按数量均分
 */
export default function AdminStatGrid({ items }: AdminStatGridProps) {
  if (items.length === 0) return null;

  const colSpan = items.length <= 2 ? 12 : items.length === 3 ? 8 : 6;

  return (
    <Row gutter={[12, 12]} className="admin-stat-grid">
      {items.map((item) => (
        <Col key={item.label} xs={12} sm={12} md={colSpan} lg={colSpan} xl={colSpan}>
          <div className={`admin-stat-card admin-stat-card--${item.accent ?? 'default'}`}>
            {item.icon ? <span className="admin-stat-card__icon">{item.icon}</span> : null}
            <div className="admin-stat-card__body">
              <span className="admin-stat-card__label">{item.label}</span>
              <span className="admin-stat-card__value">{item.value}</span>
              {item.hint ? <span className="admin-stat-card__hint">{item.hint}</span> : null}
            </div>
          </div>
        </Col>
      ))}
    </Row>
  );
}
