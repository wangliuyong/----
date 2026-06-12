import type { ThemeConfig } from 'antd';
import { theme } from 'antd';
import { inkSandDesignTokens as t } from '../../../_shared/inkSandDesignTokens';

/**
 * Ant Design 主题 — 对齐 app-web / next-host 的 Ink & Sand Token
 */
export const inkSandAntdTheme: ThemeConfig = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: t.accent,
    colorPrimaryHover: t.accentHover,
    colorPrimaryActive: t.accentActive,
    colorLink: t.accent,
    colorLinkHover: t.accentHover,
    colorLinkActive: t.accentActive,
    colorBgLayout: t.bg,
    colorBgContainer: t.surfaceElevated,
    colorText: t.text,
    colorTextSecondary: t.muted,
    colorTextTertiary: t.faint,
    colorBorder: t.line,
    colorBorderSecondary: t.line,
    fontFamily: t.fontSans,
    borderRadius: t.radius,
  },
  components: {
    Layout: {
      /** 侧栏与前台主按钮同色（暖炭 #141414） */
      siderBg: t.ink,
      triggerBg: t.ink,
      bodyBg: t.bg,
      headerBg: t.surfaceElevated,
    },
    Card: {
      borderRadiusLG: t.radius,
      boxShadowTertiary: t.shadow,
    },
    Table: {
      headerBg: 'rgba(250, 248, 245, 0.85)',
      headerColor: '#57534e',
      rowHoverBg: 'rgba(154, 52, 18, 0.03)',
      borderColor: 'rgba(20, 20, 20, 0.06)',
    },
    Menu: {
      darkItemBg: t.ink,
      darkSubMenuItemBg: '#1a1918',
      darkItemSelectedBg: t.accent,
      darkItemSelectedColor: t.btnFg,
      darkItemHoverBg: 'rgba(255, 255, 255, 0.06)',
    },
  },
};
