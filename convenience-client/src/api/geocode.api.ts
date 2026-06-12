import { request } from './client';

export interface ReverseGeocodeResult {
  cityName: string;
  address: string;
}

/** 查询逆地理编码（后端代理高德 Web 服务，各端统一） */
export async function queryReverseGeocode(
  latitude: number,
  longitude: number,
): Promise<ReverseGeocodeResult> {
  return request<ReverseGeocodeResult>(
    `/geocode/reverse?lat=${latitude}&lng=${longitude}`,
    { auth: false },
  );
}
