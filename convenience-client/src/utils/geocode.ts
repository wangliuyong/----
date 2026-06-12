/** 从地图选点 name / address 中提取城市名（uni.chooseLocation 等原生回调） */
export function formatCityDisplay(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return '当前位置';
  if (/^(北京|上海|天津|重庆)/.test(trimmed)) return trimmed.slice(0, 2);
  return trimmed.replace(/(市|地区|自治州|盟)$/, '') || trimmed;
}

/** 从地图选点 name / address 中提取城市名 */
export function extractCityFromMapResult(name?: string, address?: string): string {
  const text = `${address || ''} ${name || ''}`.trim();
  if (!text) return '当前位置';

  const direct = text.match(/(北京|上海|天津|重庆)/);
  if (direct) return direct[1];

  const cityMatch = text.match(/([\u4e00-\u9fa5]{2,12}?[市州盟])/);
  if (cityMatch) return formatCityDisplay(cityMatch[1]);

  return name?.slice(0, 12) || '当前位置';
}

export { queryReverseGeocode } from '@/api/geocode.api';
export type { ReverseGeocodeResult } from '@/api/geocode.api';
