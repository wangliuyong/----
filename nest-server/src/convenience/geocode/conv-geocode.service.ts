import { BadRequestException, Injectable } from '@nestjs/common';

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
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      throw new BadRequestException('无效的经纬度');
    }

    const key = process.env.AMAP_WEB_SERVICE_KEY || '';
    /** Key 未配置时降级返回坐标，避免小程序端 503（生产环境请在 .env 配置 AMAP_WEB_SERVICE_KEY） */
    if (!key) {
      return {
        cityName: '当前位置',
        address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
      };
    }

    const location = `${longitude},${latitude}`;
    const url =
      `https://restapi.amap.com/v3/geocode/regeo` +
      `?location=${encodeURIComponent(location)}` +
      `&key=${encodeURIComponent(key)}` +
      `&extensions=base&output=json`;

    const res = await fetch(url);
    const data = (await res.json()) as AmapRegeoResponse;

    if (data.status !== '1' || !data.regeocode) {
      /**
       * Key 无效（INVALID_USER_KEY）、配额用尽等：降级返回坐标
       * 请在 nest-server/.env 配置高德控制台「Web服务」类型 Key，并启用逆地理编码
       */
      console.warn(`[ConvGeocode] 高德逆地理失败: ${data.info || 'unknown'}`);
      return {
        cityName: '当前位置',
        address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
      };
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
