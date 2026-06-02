/**
 * 子应用 Tailwind 扩展 — 绑定 app-home 设计 Token
 */
export const accentThemeExtend = {
  colors: {
    accent: 'var(--ed-accent, #9a3412)',
    'accent-soft': 'var(--ed-accent-soft, rgba(154, 52, 18, 0.08))',
    ink: 'var(--ed-text, #141414)',
    muted: 'var(--ed-muted, #6f6a65)',
    faint: 'var(--ed-faint, #a8a29e)',
    line: 'var(--ed-line, rgba(20, 20, 20, 0.08))',
    surface: 'var(--ed-surface, rgba(255, 255, 255, 0.6))',
  },
  fontFamily: {
    serif: ['Noto Serif SC', 'Songti SC', 'serif'],
    sans: ['IBM Plex Sans', 'PingFang SC', 'Helvetica Neue', 'sans-serif'],
  },
};
