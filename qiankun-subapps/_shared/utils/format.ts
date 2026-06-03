import dayjs, { type Dayjs } from 'dayjs';
import 'dayjs/locale/zh-cn';

/** 内置日期格式预设（中文 locale） */
export const DATE_FORMAT_PRESETS = {
  /** 简短：2024年10月（默认，与原 toLocaleDateString 行为一致） */
  short: 'YYYY年M月',
  /** 中等：2024年10月15日 */
  medium: 'YYYY年M月D日',
  /** 完整：2024年10月15日 星期二 */
  long: 'YYYY年M月D日 dddd',
  /** 日期时间：2024年10月15日 14:30 */
  datetime: 'YYYY年M月D日 HH:mm',
  /** 仅时间：14:30 */
  time: 'HH:mm',
  /** ISO 日期：2024-10-15 */
  iso: 'YYYY-MM-DD',
  /** 完整 ISO 日期时间：2024-10-15 14:30:00 */
  isoDatetime: 'YYYY-MM-DD HH:mm:ss',
} as const;

/** 预设格式名称 */
export type DateFormatPreset = keyof typeof DATE_FORMAT_PRESETS;

/** 模块加载时设置中文 locale，避免每次 format 重复设置 */
dayjs.locale('zh-cn');

/**
 * 将输入解析为有效的 dayjs 实例
 * @param value - ISO 字符串、时间戳或 Date 对象
 */
function parseDate(value: string | number | Date): Dayjs | null {
  const date = dayjs(value);
  return date.isValid() ? date : null;
}

/**
 * 解析格式参数：预设名映射为格式串，否则视为自定义 dayjs 格式
 * @param format - 预设名或 dayjs 格式字符串（如 'YYYY/MM/DD'）
 */
function resolveFormat(format: DateFormatPreset | string): string {
  if (format in DATE_FORMAT_PRESETS) {
    return DATE_FORMAT_PRESETS[format as DateFormatPreset];
  }
  return format;
}

/**
 * 使用 dayjs 格式化日期，支持预设格式与自定义格式字符串。
 *
 * @param value - 日期值；空值或无效日期时返回 fallback
 * @param format - 预设名（short / medium / long 等）或 dayjs 格式串，默认 short
 * @param fallback - 占位符，默认 '—'
 *
 * @example
 * formatDate('2024-10-15')                 // '2024年10月'
 * formatDate('2024-10-15', 'medium')       // '2024年10月15日'
 * formatDate('2024-10-15', 'YYYY/MM/DD')   // '2024/10/15'
 * formatDate(undefined)                    // '—'
 */
export function formatDate(
  value?: string | number | Date | null,
  format: DateFormatPreset | string = 'short',
  fallback = '—',
): string {
  if (value == null || value === '') return fallback;

  const date = parseDate(value);
  if (!date) return fallback;

  return date.format(resolveFormat(format));
}

/** 技术栈字符串拆分为标签数组 */
export function splitStack(stack?: string): string[] {
  if (!stack) return [];
  return stack
    .split(/[,，、|/]/)
    .map((item) => item.trim())
    .filter(Boolean);
}
