import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';

dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

/** 格式化相对时间，如「3 分钟前」 */
export function formatRelativeTime(value: string | number | Date): string {
  return dayjs(value).fromNow();
}

/** 格式化日期时间 */
export function formatDateTime(value: string | number | Date, pattern = 'YYYY-MM-DD HH:mm'): string {
  return dayjs(value).format(pattern);
}

/** 格式化价格展示 */
export function formatPrice(price?: number): string {
  if (price === undefined || price === null) return '面议';
  if (price === 0) return '免费';
  return `¥${price.toFixed(2)}`;
}

/** 格式化距离展示 */
export function formatDistance(km?: number): string {
  if (km === undefined || km === null) return '';
  if (km < 1) return `${Math.round(km * 1000)}m`;
  return `${km.toFixed(1)}km`;
}

/** Haversine 公式计算两点距离（km） */
export function calcDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** 举报类型文案映射 */
export const REPORT_TYPE_LABEL: Record<string, string> = {
  SPAM: '垃圾广告',
  FRAUD: '欺诈信息',
  ILLEGAL: '违法违规',
  OTHER: '其他',
};

/** 审核状态文案 */
export const AUDIT_STATUS_LABEL: Record<string, string> = {
  PENDING: '待审核',
  APPROVED: '已通过',
  REJECTED: '已拒绝',
};

/** 手机号脱敏展示 */
export function formatPhoneMask(phone?: string): string {
  if (!phone || phone.length < 7) return '';
  return `${phone.slice(0, 3)}****${phone.slice(-4)}`;
}
