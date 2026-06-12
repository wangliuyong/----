import type { DashboardOverview } from '../types';

/** Ink & Sand 图表色板（与 inkSandDesignTokens 对齐） */
export const DASHBOARD_CHART_COLORS = {
  accent: '#9a3412',
  accentSoft: '#c2410c',
  ink: '#141414',
  sand: '#d6d3d1',
  muted: '#78716c',
  message: '#b45309',
  ai: '#44403c',
  grid: 'rgba(20, 20, 20, 0.06)',
} as const;

/** 访问与互动趋势折线图 */
export function buildVisitTrendOption(
  dailyTrend: DashboardOverview['charts']['dailyTrend'],
) {
  const labels = dailyTrend.map((item) => item.label);

  return {
    color: [DASHBOARD_CHART_COLORS.accent, DASHBOARD_CHART_COLORS.message, DASHBOARD_CHART_COLORS.ai],
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#fff',
      borderColor: DASHBOARD_CHART_COLORS.grid,
      textStyle: { color: DASHBOARD_CHART_COLORS.ink, fontSize: 12 },
    },
    legend: {
      data: ['页面访问', '新增留言', 'AI 会话'],
      bottom: 0,
      textStyle: { color: DASHBOARD_CHART_COLORS.muted, fontSize: 12 },
    },
    grid: { left: 12, right: 16, top: 24, bottom: 48, containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: labels,
      axisLine: { lineStyle: { color: DASHBOARD_CHART_COLORS.grid } },
      axisLabel: { color: DASHBOARD_CHART_COLORS.muted, fontSize: 11 },
    },
    yAxis: {
      type: 'value',
      minInterval: 1,
      splitLine: { lineStyle: { color: DASHBOARD_CHART_COLORS.grid } },
      axisLabel: { color: DASHBOARD_CHART_COLORS.muted, fontSize: 11 },
    },
    series: [
      {
        name: '页面访问',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { width: 2.5 },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(154, 52, 18, 0.18)' },
              { offset: 1, color: 'rgba(154, 52, 18, 0.02)' },
            ],
          },
        },
        data: dailyTrend.map((item) => item.pageViews),
      },
      {
        name: '新增留言',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        data: dailyTrend.map((item) => item.messages),
      },
      {
        name: 'AI 会话',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        data: dailyTrend.map((item) => item.aiSessions),
      },
    ],
  };
}

/** 热门页面横向柱状图 */
export function buildTopPagesOption(topPages: DashboardOverview['charts']['topPages']) {
  const paths = [...topPages].reverse().map((item) => item.path);
  const values = [...topPages].reverse().map((item) => item.views);

  return {
    color: [DASHBOARD_CHART_COLORS.accent],
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: '#fff',
      borderColor: DASHBOARD_CHART_COLORS.grid,
      textStyle: { color: DASHBOARD_CHART_COLORS.ink, fontSize: 12 },
    },
    grid: { left: 8, right: 24, top: 8, bottom: 8, containLabel: true },
    xAxis: {
      type: 'value',
      minInterval: 1,
      splitLine: { lineStyle: { color: DASHBOARD_CHART_COLORS.grid } },
      axisLabel: { color: DASHBOARD_CHART_COLORS.muted, fontSize: 11 },
    },
    yAxis: {
      type: 'category',
      data: paths,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: DASHBOARD_CHART_COLORS.ink,
        fontSize: 11,
        width: 120,
        overflow: 'truncate',
      },
    },
    series: [
      {
        type: 'bar',
        barWidth: 14,
        itemStyle: { borderRadius: [0, 2, 2, 0] },
        data: values,
      },
    ],
  };
}

/** 站点内容构成环形图 */
export function buildContentMixOption(contentMix: DashboardOverview['charts']['contentMix']) {
  const data = [
    { name: '博客', value: contentMix.articles },
    { name: '项目', value: contentMix.projects },
    { name: '友链', value: contentMix.links },
  ].filter((item) => item.value > 0);

  return {
    color: ['#9a3412', '#78716c', '#d6d3d1'],
    tooltip: {
      trigger: 'item',
      backgroundColor: '#fff',
      borderColor: DASHBOARD_CHART_COLORS.grid,
      textStyle: { color: DASHBOARD_CHART_COLORS.ink, fontSize: 12 },
    },
    legend: {
      bottom: 0,
      textStyle: { color: DASHBOARD_CHART_COLORS.muted, fontSize: 12 },
    },
    series: [
      {
        type: 'pie',
        radius: ['42%', '68%'],
        center: ['50%', '44%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          formatter: '{b}\n{c}',
          color: DASHBOARD_CHART_COLORS.ink,
          fontSize: 11,
        },
        data,
      },
    ],
  };
}
