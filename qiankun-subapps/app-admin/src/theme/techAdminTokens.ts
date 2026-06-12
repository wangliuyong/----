/**
 * Tech Admin 设计 Token — 深色科技风后台专用
 * 与 src/styles/tech-admin-tokens.scss 保持同步，不影响 app-web 前台
 */
export const techAdminTokens = {
  /** 主背景：深蓝黑 */
  bg: '#070b14',
  bgElevated: '#0c1222',
  bgHeader: 'rgba(12, 18, 34, 0.88)',

  /** 玻璃面板 */
  surface: 'rgba(15, 23, 42, 0.72)',
  surfaceSolid: '#111827',
  surfaceHover: 'rgba(30, 41, 59, 0.85)',

  /** 强调色：电光青 */
  accent: '#22d3ee',
  accentHover: '#06b6d4',
  accentActive: '#0891b2',
  accentSoft: 'rgba(34, 211, 238, 0.12)',
  accentBorder: 'rgba(34, 211, 238, 0.28)',
  accentGlow: 'rgba(34, 211, 238, 0.35)',

  /** 文字层级 */
  text: '#e2e8f0',
  muted: '#94a3b8',
  faint: '#64748b',

  /** 分割与阴影 */
  line: 'rgba(148, 163, 184, 0.12)',
  lineStrong: 'rgba(148, 163, 184, 0.22)',
  shadow: '0 24px 64px -32px rgba(0, 0, 0, 0.65)',
  shadowGlow: '0 0 40px -8px rgba(34, 211, 238, 0.25)',

  /** 语义色 */
  danger: '#f87171',
  success: '#34d399',
  warning: '#fbbf24',

  /** 侧栏 */
  siderBg: '#050810',
  siderBorder: 'rgba(34, 211, 238, 0.08)',

  /** 字体 */
  fontSans: "'IBM Plex Sans', 'PingFang SC', 'Helvetica Neue', sans-serif",
  fontMono: "'IBM Plex Mono', 'JetBrains Mono', 'Fira Code', monospace",

  /** 圆角体系：全 soft 12px */
  radius: 12,
  radiusSm: 8,
  radiusLg: 16,
} as const;
