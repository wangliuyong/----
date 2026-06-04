/** 前台站点路由 key（与 app-web WEB_ROUTE_CONFIG 对齐） */
export type SiteRouteKey = 'home' | 'about' | 'blog' | 'projects' | 'contact' | 'links';

export interface SiteRouteDef {
  key: SiteRouteKey;
  /** 导航 href / 路径前缀 */
  path: string;
  /** API 未就绪时的默认导航文案 */
  label: string;
  /** 是否匹配子路径（如 /blog/:id） */
  matchPrefix?: boolean;
  /** 由 Next.js 服务端渲染（不走 Qiankun 子应用） */
  ssr?: boolean;
  /** 基座额外挂载逻辑 */
  hostExtras?: 'contact';
}

/**
 * 前台路由单一数据源
 * 驱动：Next catch-all、Qiankun activeRule、默认导航、404 判定
 */
export const SITE_ROUTE_CONFIG: SiteRouteDef[] = [
  { key: 'home', path: '/', label: '首页', ssr: true },
  { key: 'about', path: '/about', label: '关于我' },
  { key: 'blog', path: '/blog', label: '博客', matchPrefix: true, ssr: true },
  { key: 'projects', path: '/projects', label: '项目' },
  { key: 'contact', path: '/contact', label: '联系我', hostExtras: 'contact' },
  { key: 'links', path: '/links', label: '友链' },
];

/** 默认顶栏导航（与 SITE_ROUTE_CONFIG 同步） */
export const FALLBACK_NAV = SITE_ROUTE_CONFIG.map(({ path, label }) => ({
  href: path,
  label,
}));
