import { tool } from 'langchain';
import * as z from 'zod';

/**
 * 图表生成工具：根据结构化数据返回 ECharts option JSON，供前端直接渲染。
 */
export function createGenerateChartTool() {
  return tool(
    async ({ chartType, title, labels, values }) => {
      const option = buildEchartsOption(chartType, title, labels, values);
      return JSON.stringify({ type: 'chart', option });
    },
    {
      name: 'generate_chart',
      description:
        '根据数据生成 ECharts 图表配置。当用户要求可视化、统计图、柱状图、折线图、饼图时使用。',
      schema: z.object({
        chartType: z
          .enum(['bar', 'line', 'pie'])
          .describe('图表类型：bar 柱状图、line 折线图、pie 饼图'),
        title: z.string().describe('图表标题'),
        labels: z.array(z.string()).describe('分类标签数组'),
        values: z.array(z.number()).describe('对应数值数组，长度与 labels 一致'),
      }),
    },
  );
}

/** 构建 ECharts option 对象 */
function buildEchartsOption(
  chartType: 'bar' | 'line' | 'pie',
  title: string,
  labels: string[],
  values: number[],
) {
  if (chartType === 'pie') {
    return {
      title: { text: title, left: 'center' },
      tooltip: { trigger: 'item' },
      series: [
        {
          type: 'pie',
          radius: '60%',
          data: labels.map((name, i) => ({ name, value: values[i] ?? 0 })),
        },
      ],
    };
  }

  return {
    title: { text: title },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: labels },
    yAxis: { type: 'value' },
    series: [{ type: chartType, data: values }],
  };
}
