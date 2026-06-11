/** 统一 API 响应结构，与 NestJS 全局拦截器对齐 */
export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
}

/** 分页列表响应 */
export interface PageResult<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

/** 分页查询参数 */
export interface PageQuery {
  page?: number;
  pageSize?: number;
}
