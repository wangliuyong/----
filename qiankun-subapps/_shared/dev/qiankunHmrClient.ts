/** Qiankun 基座会在 window 上注入 __POWERED_BY_QIANKUN__，避免依赖 vite-plugin-qiankun（生产构建无法从 _shared 解析） */
function isQiankunHost(): boolean {
  return !!(window as Window & { __POWERED_BY_QIANKUN__?: boolean }).__POWERED_BY_QIANKUN__;
}

/** 从子应用 Vite dev server 拉取 HMR WebSocket token（Vite 6 跨域连接必须带 token） */
async function fetchViteWsToken(devPort: number): Promise<string | null> {
  try {
    const res = await fetch(`http://localhost:${devPort}/@vite/client`, { mode: 'cors' });
    if (!res.ok) return null;
    const text = await res.text();
    const match = text.match(/const wsToken = "([^"]+)"/);
    return match?.[1] ?? null;
  } catch {
    return null;
  }
}

/**
 * 在 Qiankun 基座（localhost:3000）内连接子应用 Vite 的 HMR WebSocket。
 * 子应用脚本由 import-html-entry eval 加载，不会自动注入 @vite/client，需手动监听变更并刷新基座页面。
 */
export function setupQiankunHmr(devPort: number) {
  if (!import.meta.env.DEV || !devPort) return;
  if (typeof window === 'undefined') return;
  if (!isQiankunHost()) return;

  const key = `__qiankun_hmr_${devPort}__` as const;
  type WindowWithHmr = Window & {
    [K in typeof key]?: WebSocket;
    [P in `${typeof key}_retry`]?: number;
  };
  const win = window as WindowWithHmr;
  if (win[key]) return;

  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';

  const scheduleReconnect = (delayMs = 2000) => {
    window.clearTimeout(win[`${key}_retry`]);
    win[`${key}_retry`] = window.setTimeout(() => {
      void connect();
    }, delayMs);
  };

  const connect = async () => {
    const token = await fetchViteWsToken(devPort);
    if (!token) {
      scheduleReconnect();
      return;
    }

    // Vite 6：页面 Origin 为 :3000、WS 连 :4001 时，服务端校验 ?token=
    const url = `${protocol}://localhost:${devPort}/?token=${encodeURIComponent(token)}`;
    const ws = new WebSocket(url, 'vite-hmr');
    win[key] = ws;

    ws.addEventListener('open', () => {
      window.clearTimeout(win[`${key}_retry`]);
    });

    ws.addEventListener('message', (event) => {
      try {
        const data = JSON.parse(String(event.data)) as { type?: string };
        if (data.type === 'full-reload' || data.type === 'update') {
          window.location.reload();
        }
      } catch {
        // 忽略 ping / 非 JSON 消息
      }
    });

    ws.addEventListener('close', () => {
      if (win[key] === ws) {
        win[key] = undefined;
        scheduleReconnect();
      }
    });

    ws.addEventListener('error', () => {
      ws.close();
    });
  };

  void connect();
}
