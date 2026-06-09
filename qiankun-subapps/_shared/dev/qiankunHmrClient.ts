/** Qiankun 基座会在 window 上注入 __POWERED_BY_QIANKUN__，避免依赖 vite-plugin-qiankun（生产构建无法从 _shared 解析） */
function isQiankunHost(): boolean {
  return !!(window as Window & { __POWERED_BY_QIANKUN__?: boolean }).__POWERED_BY_QIANKUN__;
}

/**
 * 在 Qiankun 基座（localhost:3000）内订阅子应用 dev server 的文件变更。
 * Qiankun 模式关闭 Vite HMR（避免 React Refresh preamble），改走 SSE /__qiankun_reload。
 */
export function setupQiankunHmr(devPort: number) {
  if (!import.meta.env.DEV || !devPort) return;
  if (typeof window === 'undefined') return;
  if (!isQiankunHost()) return;

  const key = `__qiankun_hmr_${devPort}__` as const;
  type WindowWithHmr = Window & {
    [K in typeof key]?: EventSource;
    [P in `${typeof key}_retry`]?: number;
  };
  const win = window as WindowWithHmr;
  if (win[key]) return;

  const scheduleReconnect = (delayMs = 2000) => {
    window.clearTimeout(win[`${key}_retry`]);
    win[`${key}_retry`] = window.setTimeout(() => {
      connect();
    }, delayMs);
  };

  const connect = () => {
    const es = new EventSource(`http://localhost:${devPort}/__qiankun_reload`);
    win[key] = es;

    es.addEventListener('open', () => {
      window.clearTimeout(win[`${key}_retry`]);
    });

    es.addEventListener('reload', () => {
      window.location.reload();
    });

    es.onerror = () => {
      es.close();
      if (win[key] === es) {
        win[key] = undefined;
        scheduleReconnect();
      }
    };
  };

  connect();
}
