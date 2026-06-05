import type { RouteObject } from 'react-router-dom';
import { getPageByPath } from './pageRegistry';

const keepLoaderData: NonNullable<RouteObject['shouldRevalidate']> = () => false;

/**
 * 不在 RBAC 菜单中注册的子页面路由。
 * 父级菜单 path 仍指向列表页，编辑/新建通过 navigate 进入。
 */
export function buildHiddenAdminRoutes(): RouteObject[] {
  const createPage = getPageByPath('articles/create');
  const editPage = getPageByPath('articles/edit');

  const routes: RouteObject[] = [];

  if (createPage) {
    routes.push({
      path: 'articles/create',
      Component: createPage,
      shouldRevalidate: keepLoaderData,
    });
  }

  if (editPage) {
    routes.push({
      path: 'articles/edit/:id',
      Component: editPage,
      shouldRevalidate: keepLoaderData,
    });
  }

  return routes;
}
