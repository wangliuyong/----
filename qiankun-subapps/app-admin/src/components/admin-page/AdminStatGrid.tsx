import type { AdminStatItem } from './types';

export interface AdminStatGridProps {
  items: AdminStatItem[];
}

/** 页面顶部统计指标网格 */
export default function AdminStatGrid({ items }: AdminStatGridProps) {
  if (items.length === 0) return null;

  return (
    <div
      className="admin-stat-grid"
      style={{ gridTemplateColumns: `repeat(${Math.min(items.length, 4)}, minmax(0, 1fr))` }}
    >
      {items.map((item) => (
        <div key={item.label} className={`admin-stat-card admin-stat-card--${item.accent ?? 'default'}`}>
          {item.icon ? <span className="admin-stat-card__icon">{item.icon}</span> : null}
          <div className="admin-stat-card__body">
            <span className="admin-stat-card__label">{item.label}</span>
            <span className="admin-stat-card__value">{item.value}</span>
            {item.hint ? <span className="admin-stat-card__hint">{item.hint}</span> : null}
          </div>
        </div>
      ))}
    </div>
  );
}
