import dayjs from 'dayjs';

/** 将 API 返回的 ISO 时间转为 DatePicker 值 */
export function articlePublishedAtToDayjs(publishedAt?: string) {
  return publishedAt ? dayjs(publishedAt) : undefined;
}

/** 提交前将 DatePicker 值转为 ISO 字符串 */
export function dayjsToPublishedAt(value: unknown): string | undefined {
  if (!value || !dayjs.isDayjs(value)) return undefined;
  return value.toISOString();
}
