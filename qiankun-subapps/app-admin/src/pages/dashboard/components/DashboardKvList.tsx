import type { ReactNode } from 'react';

export interface DashboardKvItem {
  key: string;
  label: string;
  value: ReactNode;
  /** 数值类展示：等宽数字、略加粗 */
  emphasize?: boolean;
  breakValue?: boolean;
  wrapValue?: boolean;
}

/** 标签 + 值行：label 固定不换行，value 在右侧独立列 */
export default function DashboardKvList({ items }: { items: DashboardKvItem[] }) {
  return (
    <dl className="dashboard-kv">
      {items.map((item) => (
        <div key={item.key} className="dashboard-kv__row">
          <dt className="dashboard-kv__label">{item.label}</dt>
          <dd
            className={[
              'dashboard-kv__value',
              item.emphasize && 'dashboard-kv__value--num',
              item.breakValue && 'dashboard-kv__value--break',
              item.wrapValue && 'dashboard-kv__value--wrap',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
