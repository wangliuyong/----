/** 直辖市省级名称 */
const MUNICIPALITIES = ['北京市', '上海市', '天津市', '重庆市'];

/**
 * 格式化省市区为首页顶栏展示文案
 * - 直辖市：上海 / 上海·黄浦
 * - 其他：广州
 */
export function formatRegionLabel(province: string, city: string, district = ''): string {
  if (MUNICIPALITIES.includes(province)) {
    const short = province.replace(/市$/, '');
    if (district && district !== city && district !== province) {
      const d = district.replace(/(区|县|市)$/, '');
      return `${short}·${d}`;
    }
    return short;
  }

  const cityShort = city.replace(/(市|地区|自治州|盟)$/, '') || city;
  return cityShort || province.replace(/(省|自治区|特别行政区)$/, '') || '选择区域';
}

/** 拼接完整省市区地址 */
export function formatRegionFull(province: string, city: string, district = ''): string {
  return `${province}${city}${district}`;
}
