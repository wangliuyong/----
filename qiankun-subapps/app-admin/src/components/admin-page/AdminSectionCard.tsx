import type { ReactNode } from 'react';

export interface AdminSectionCardProps {
  title?: ReactNode;
  extra?: ReactNode;
  children: ReactNode;
  noPadding?: boolean;
}

/** 页面内容区卡片：玻璃拟态面板 */
export default function AdminSectionCard({
  title,
  extra,
  children,
  noPadding = false,
}: AdminSectionCardProps) {
  return (
    <section
      className={[
        'admin-section-card',
        noPadding && 'admin-section-card--flush',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {title || extra ? (
        <header className="admin-section-card__head">
          {title ? <h3 className="admin-section-card__title">{title}</h3> : <span />}
          {extra ? <div className="admin-section-card__extra">{extra}</div> : null}
        </header>
      ) : null}
      <div className="admin-section-card__body">{children}</div>
    </section>
  );
}
