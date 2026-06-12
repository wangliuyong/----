import { BadRequestException, Injectable, ServiceUnavailableException } from '@nestjs/common';

/** 高德逆地理编码 API 响应（精简） */
interface AmapRegeoResponse {
  status: string;
  info: string;
  regeocode?: {
    formatted_address?: string;
    addressComponent?: {
      province?: string;
      city?: string | string[];
      district?: string;
      township?: string;
    };
  };
}

/** 格式化城市展示名 */
function formatCityDisplay(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return '当前位置';
  if (/^(北京|上海|天津|重庆)/.test(trimmed)) return trimmed.slice(0, 2);
  return trimmed.replace(/(市|地区|自治州|盟)$/, '') || trimmed;
}

/** 高德 Web 服务：逆地理编码（统一各端地址解析） */
@Injectable()
export class ConvGeocodeService {
  /** 经纬度 → 城市名 + 完整地址（GCJ-02，高德 location 格式：经度,纬度） */
  async reverseGeocode(latitude: number, longitude: number) {
    const key = process.env.AMAP_WEB_SERVICE_KEY || '';
    if (!key) {
      throw new ServiceUnavailableException('高德地图 Web 服务 Key 未配置（AMAP_WEB_SERVICE_KEY）');
    }

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      throw new BadRequestException('无效的经纬度');
    }

    const location = `${longitude},${latitude}`;
    const url =
      `https://restapi.amap.com/v3/geocode/regeocode` +
      `?location=${encodeURIComponent(location)}` +
      `&key=${encodeURIComponent(key)}` +
      `&extensions=base&output=json`;

    const res = await fetch(url);
    const data = (await res.json()) as AmapRegeoResponse;

    if (data.status !== '1' || !data.regeocode) {
      throw new BadRequestException(data.info || '逆地理编码失败');
    }

    const comp = data.regeocode.addressComponent;
    const rawCity = Array.isArray(comp?.city)
      ? comp.city[0] || comp?.province || comp?.district
      : comp?.city || comp?.province || comp?.district || '';

    const cityName = formatCityDisplay(String(rawCity || '当前位置'));
    const address =
      data.regeocode.formatted_address ||
      [comp?.province, comp?.district, comp?.township].filter(Boolean).join('') ||
      `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;

    return { cityName, address };
  }
}
