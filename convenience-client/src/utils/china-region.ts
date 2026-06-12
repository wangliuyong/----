/**
 * 中国省市区数据（@vant/area-data，H5/App/小程序全端可用）
 */
import { areaList } from '@vant/area-data';

/** 选择器列项 */
export interface RegionOption {
  text: string;
  value: string;
}

/** 全部省份 */
export function queryProvinces(): RegionOption[] {
  return Object.entries(areaList.province_list)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([value, text]) => ({ text, value }));
}

/** 某省下的城市 */
export function queryCitiesByProvince(provinceCode: string): RegionOption[] {
  const prefix = provinceCode.slice(0, 2);
  return Object.entries(areaList.city_list)
    .filter(([code]) => code.slice(0, 2) === prefix)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([value, text]) => ({ text, value }));
}

/** 某市下的区县（无区县时返回占位项） */
export function queryDistrictsByCity(cityCode: string): RegionOption[] {
  const prefix = cityCode.slice(0, 4);
  const list = Object.entries(areaList.county_list)
    .filter(([code]) => code.slice(0, 4) === prefix)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([value, text]) => ({ text, value }));

  return list.length ? list : [{ text: '市辖区', value: '' }];
}

/** 根据省市区名称反查 adcode */
export function queryRegionCodes(province: string, city: string, district = ''): string[] {
  const { province_list, city_list, county_list } = areaList;

  const provinceCode = Object.entries(province_list).find(([, name]) => name === province)?.[0];
  if (!provinceCode) return [];

  const cityCode = Object.entries(city_list)
    .filter(([code]) => code.slice(0, 2) === provinceCode.slice(0, 2))
    .find(([, name]) => name === city)?.[0];
  if (!cityCode) return [provinceCode];

  if (!district) return [provinceCode, cityCode];

  const districtCode = Object.entries(county_list)
    .filter(([code]) => code.slice(0, 4) === cityCode.slice(0, 4))
    .find(([, name]) => name === district)?.[0];

  return districtCode ? [provinceCode, cityCode, districtCode] : [provinceCode, cityCode];
}

/** adcode → 省市区名称 */
export function queryRegionNames(codes: string[]): {
  province: string;
  city: string;
  district: string;
} {
  const { province_list, city_list, county_list } = areaList;
  const [pCode, cCode, dCode] = codes;

  return {
    province: (pCode && province_list[pCode]) || '',
    city: (cCode && city_list[cCode]) || '',
    district: (dCode && county_list[dCode]) || '',
  };
}

/** 构建 u-picker 三列初始数据 */
export function buildRegionPickerColumns(codes: string[] = []): RegionOption[][] {
  const provinces = queryProvinces();
  const provinceCode = codes[0] || provinces[0]?.value || '';
  const cities = queryCitiesByProvince(provinceCode);
  const cityCode = codes[1] || cities[0]?.value || '';
  const districts = queryDistrictsByCity(cityCode);

  return [provinces, cities, districts];
}

/** 根据 adcode 计算各列默认索引 */
export function queryPickerDefaultIndex(
  columns: RegionOption[][],
  codes: string[],
): number[] {
  const findIndex = (col: RegionOption[], code?: string) => {
    if (!code) return 0;
    const idx = col.findIndex((item) => item.value === code);
    return idx >= 0 ? idx : 0;
  };

  return [
    findIndex(columns[0], codes[0]),
    findIndex(columns[1], codes[1]),
    findIndex(columns[2], codes[2]),
  ];
}

/** 从 picker 选中项解析名称 */
export function parseRegionPickerValue(items: RegionOption[]): {
  province: string;
  city: string;
  district: string;
} {
  const province = items[0]?.text || '';
  const city = items[1]?.text || '';
  const rawDistrict = items[2]?.text || '';
  const district = rawDistrict === '市辖区' ? '' : rawDistrict;

  return { province, city, district };
}
