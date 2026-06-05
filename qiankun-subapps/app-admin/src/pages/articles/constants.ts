/** 博客模块路由路径（子页面不在 RBAC 菜单中，由 hiddenRoutes 注册） */
export const ARTICLE_ROUTES = {
  list: '/articles',
  create: '/articles/create',
  edit: (id: number) => `/articles/edit/${id}`,
} as const;

/** 博客相关权限码 */
export const ARTICLE_PERMISSIONS = {
  create: 'admin:articles:create',
  update: 'admin:articles:update',
  delete: 'admin:articles:delete',
} as const;

/** 不参与模块管理「可选页面路径」的子路由 */
export const ARTICLE_HIDDEN_PAGE_PATHS = ['articles/create', 'articles/edit'] as const;
