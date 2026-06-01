/**
 * 动态加载 Web Component 脚本（带去重）
 * @param url 脚本地址，如 /wc/wc-home.js
 */
export async function loadWebComponent(url: string): Promise<void> {
  if (typeof document === 'undefined') return;

  const exist = document.querySelector(`script[src="${url}"]`);
  if (exist) return;

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = url;
    script.onload = () => resolve();
    script.onerror = (e) => reject(e);
    document.body.appendChild(script);
  });
}

/** WC 脚本根路径 */
export function wcScriptUrl(name: string): string {
  const base = process.env.NEXT_PUBLIC_WC_BASE || '/wc';
  return `${base}/${name}.js`;
}

/** API 根路径，透传给子组件 */
export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001/api';
