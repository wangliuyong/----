import { request } from './client';
import type { CategoryItem } from '@/types/city-info';

/** 查询分类树 */
export function queryCategoryTree(): Promise<CategoryItem[]> {
  return request<CategoryItem[]>('/categories/tree');
}

/** 查询一级分类 */
export function queryRootCategories(): Promise<CategoryItem[]> {
  return request<CategoryItem[]>('/categories/root');
}
