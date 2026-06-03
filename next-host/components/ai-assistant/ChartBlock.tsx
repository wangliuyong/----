'use client';

import { lazy, Suspense } from 'react';

const ReactECharts = lazy(() => import('echarts-for-react'));

interface ChartBlockProps {
  option: Record<string, unknown>;
}

/** ECharts 图表块（懒加载，避免首屏体积过大） */
export function ChartBlock({ option }: ChartBlockProps) {
  return (
    <div className="dog-ai-chart">
      <Suspense fallback={<div className="dog-ai-chart__loading">图表渲染中…</div>}>
        <ReactECharts option={option} style={{ height: 260, width: '100%' }} notMerge lazyUpdate />
      </Suspense>
    </div>
  );
}
