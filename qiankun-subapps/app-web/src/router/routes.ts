/** React Router basename：前台路径均在站点根下，Qiankun / 独立运行均为 / */
export function getRouterBasename(): string {
  return '/';
}

/** 博客详情页相对路径 */
export function blogDetailPath(id: string | number): string {
  return `/blog/${id}`;
}
