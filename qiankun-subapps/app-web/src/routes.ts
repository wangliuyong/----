/** app-web 内子路由页面标识 */
export type WebPageKey = 'home' | 'about' | 'blog' | 'projects' | 'contact' | 'links';

/** 根据基座 pathname 解析当前应渲染的页面 */
export function resolveWebPage(pathname: string): WebPageKey {
  if (pathname === '/') return 'home';
  if (pathname === '/about') return 'about';
  if (pathname === '/blog' || pathname.startsWith('/blog/')) return 'blog';
  if (pathname === '/projects') return 'projects';
  if (pathname === '/contact') return 'contact';
  if (pathname === '/links') return 'links';
  return 'home';
}
