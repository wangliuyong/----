import { request } from './client';
import type { CategoryItem } from '@/types/city-info';

/** 查询分类树（公开接口） */
export function queryCategoryTree(): Promise<CategoryItem[]> {
  return request<CategoryItem[]>('/categories/tree', { auth: false });
}

/** 查询一级分类（公开接口） */
export function queryRootCategories(): Promise<CategoryItem[]> {
  return request<CategoryItem[]>('/categories/root', { auth: false });
}
