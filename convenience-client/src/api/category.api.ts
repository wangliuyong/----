import { request } from './client';
import { mockCategories, mockDelay } from '@/mock/data';
import { useMock } from '@/utils/platform';
import type { CategoryItem } from '@/types/city-info';

/** 查询分类树 */
export async function queryCategoryTree(): Promise<CategoryItem[]> {
  if (useMock()) {
    await mockDelay(200);
    return JSON.parse(JSON.stringify(mockCategories));
  }
  return request<CategoryItem[]>('/categories/tree');
}

/** 查询一级分类 */
export async function queryRootCategories(): Promise<CategoryItem[]> {
  if (useMock()) {
    await mockDelay(200);
    return mockCategories.map(({ children, ...rest }) => rest);
  }
  return request<CategoryItem[]>('/categories/root');
}
