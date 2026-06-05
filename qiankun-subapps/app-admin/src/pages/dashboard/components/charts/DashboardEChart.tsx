import { lazy, Suspense } from 'react';

const ReactECharts = lazy(() => import('echarts-for-react'));

interface DashboardEChartProps {
  option: Record<string, unknown>;
  height?: number;
  className?: string;
}

/** 管理端 ECharts 懒加载容器 */
export default function DashboardEChart({
  option,
  height = 280,
  className,
}: DashboardEChartProps) {
  return (
    <div className={className} style={{ height }}>
      <Suspense fallback={<div className="dashboard-chart__loading">图表加载中…</div>}>
        <ReactECharts
          option={option}
          style={{ height: '100%', width: '100%' }}
          notMerge
          lazyUpdate
        />
      </Suspense>
    </div>
  );
}
