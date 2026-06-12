import { FileExclamationOutlined } from '@ant-design/icons';
import type { ConvReportQuery } from '../../../../types/convenience';
import {
  REPORT_TYPE_CONFIG,
  type ReportTypeKey,
  type ReportTypeStats,
} from '../constants';

export interface ReportTypeBreakdownProps {
  stats: ReportTypeStats;
  loading?: boolean;
  activeType?: ConvReportQuery['reportType'];
  onTypeClick: (type?: ReportTypeKey) => void;
}

/**
 * 举报类型分布：可点击切换筛选
 * 展示各类型数量与占比，便于快速定位高风险类别
 */
export default function ReportTypeBreakdown({
  stats,
  loading,
  activeType,
  onTypeClick,
}: ReportTypeBreakdownProps) {
  const types = Object.keys(REPORT_TYPE_CONFIG) as ReportTypeKey[];

  return (
    <div className="report-type-breakdown">
      <button
        type="button"
        className={`report-type-chip${!activeType ? ' report-type-chip--active' : ''}`}
        disabled={loading}
        onClick={() => onTypeClick(undefined)}
      >
        <span className="report-type-chip__label">全部</span>
        <span className="report-type-chip__value">{stats.total}</span>
      </button>

      {types.map((key) => {
        const cfg = REPORT_TYPE_CONFIG[key];
        const count = stats.byType[key] ?? 0;
        const ratio = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
        const isActive = activeType === key;

        return (
          <button
            key={key}
            type="button"
            className={`report-type-chip report-type-chip--${cfg.accent}${isActive ? ' report-type-chip--active' : ''}`}
            disabled={loading}
            onClick={() => onTypeClick(key)}
            title={cfg.description}
          >
            <span className="report-type-chip__icon">{cfg.icon}</span>
            <span className="report-type-chip__body">
              <span className="report-type-chip__label">{cfg.label}</span>
              <span className="report-type-chip__meta">
                {count} 条{stats.total > 0 ? ` · 占 ${ratio}%` : ''}
              </span>
            </span>
          </button>
        );
      })}

      {stats.total === 0 && !loading ? (
        <span className="report-type-breakdown__empty">
          <FileExclamationOutlined /> 当前无举报数据
        </span>
      ) : null}
    </div>
  );
}
