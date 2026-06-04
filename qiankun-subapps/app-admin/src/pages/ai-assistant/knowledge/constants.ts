import { AI_SOURCE_OPTIONS } from '../../../api/ai.api';

/** 数据源 value → 展示文案 */
export const SOURCE_LABEL: Record<string, string> = Object.fromEntries(
  AI_SOURCE_OPTIONS.map((o) => [o.value, o.label]),
);
