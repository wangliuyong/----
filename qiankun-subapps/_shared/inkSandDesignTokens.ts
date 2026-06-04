/**
 * Ink & Sand 设计色值（与 _shared/styles/tokens.scss 保持同步）
 * 供 Ant Design ConfigProvider、内联样式等 TS 侧引用
 */
export const inkSandDesignTokens = {
  /** 浅色模式强调色 */
  accent: '#9a3412',
  accentHover: '#7c2d12',
  accentActive: '#6b2710',
  accentSoft: 'rgba(154, 52, 18, 0.08)',
  accentBorder: 'rgba(154, 52, 18, 0.22)',

  /** 暗色模式强调色（与 html.dark 下 --ed-accent 一致） */
  accentDark: '#f97316',
  accentDarkHover: '#fb923c',

  bg: '#faf8f5',
  bgHeader: 'rgba(250, 248, 245, 0.88)',
  surface: 'rgba(255, 255, 255, 0.6)',
  surfaceElevated: '#ffffff',

  text: '#141414',
  muted: '#6f6a65',
  faint: '#a8a29e',

  line: 'rgba(20, 20, 20, 0.08)',
  shadow: '0 24px 48px -32px rgba(20, 20, 20, 0.18)',

  /** 主按钮 / 侧栏深色底 */
  ink: '#141414',
  btnFg: '#faf8f5',

  fontSans: "'IBM Plex Sans', 'PingFang SC', 'Helvetica Neue', sans-serif",
  fontSerif: "'Noto Serif SC', 'Songti SC', serif",

  /** 与 app-web 卡片圆角一致 */
  radius: 2,
} as const;
