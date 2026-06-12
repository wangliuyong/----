import type { AdminPageShellProps } from './types';
import AdminStatGrid from './AdminStatGrid';

/**
 * 后台页面统一外壳：Hero 标题区 + 统计指标 + 内容区
 * 对齐 Tech Admin 设计语言，提升信息层次与可读性
 */
export default function AdminPageShell({
  title,
  description,
  extra,
  stats,
  children,
  className,
}: AdminPageShellProps) {
  return (
    <div className={['admin-page', className].filter(Boolean).join(' ')}>
      <header className="admin-page__hero">
        <div className="admin-page__hero-copy">
          <h1 className="admin-page__title">{title}</h1>
          {description ? <p className="admin-page__description">{description}</p> : null}
        </div>
        {extra ? <div className="admin-page__hero-actions">{extra}</div> : null}
      </header>

      {stats && stats.length > 0 ? <AdminStatGrid items={stats} /> : null}

      <div className="admin-page__body">{children}</div>
    </div>
  );
}
