import type { ThemeConfig } from 'antd';
import { theme } from 'antd';
import { techAdminTokens as t } from './techAdminTokens';

/**
 * Ant Design 过渡主题 — 对齐 Tech Admin 深色科技风
 * 未迁移至自定义组件的页面仍通过此主题保持视觉一致
 */
export const techAdminAntdTheme: ThemeConfig = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: t.accent,
    colorPrimaryHover: t.accentHover,
    colorPrimaryActive: t.accentActive,
    colorLink: t.accent,
    colorLinkHover: t.accentHover,
    colorLinkActive: t.accentActive,
    colorBgLayout: t.bg,
    colorBgContainer: t.surfaceSolid,
    colorBgElevated: t.bgElevated,
    colorText: t.text,
    colorTextSecondary: t.muted,
    colorTextTertiary: t.faint,
    colorBorder: t.line,
    colorBorderSecondary: t.lineStrong,
    colorError: t.danger,
    colorSuccess: t.success,
    colorWarning: t.warning,
    fontFamily: t.fontSans,
    borderRadius: t.radiusSm,
    wireframe: false,
  },
  components: {
    Layout: {
      siderBg: t.siderBg,
      triggerBg: t.siderBg,
      bodyBg: t.bg,
      headerBg: t.bgHeader,
    },
    Card: {
      borderRadiusLG: t.radius,
      colorBgContainer: t.surfaceSolid,
      boxShadowTertiary: t.shadow,
    },
    Table: {
      headerBg: 'rgba(15, 23, 42, 0.95)',
      headerColor: t.muted,
      rowHoverBg: t.accentSoft,
      borderColor: t.line,
      colorBgContainer: t.surfaceSolid,
    },
    Menu: {
      darkItemBg: t.siderBg,
      darkSubMenuItemBg: '#080d18',
      darkItemSelectedBg: t.accentSoft,
      darkItemSelectedColor: t.accent,
      darkItemHoverBg: 'rgba(34, 211, 238, 0.06)',
    },
    Modal: {
      contentBg: t.bgElevated,
      headerBg: t.bgElevated,
    },
    Input: {
      colorBgContainer: 'rgba(15, 23, 42, 0.85)',
      activeBorderColor: t.accent,
      hoverBorderColor: t.accentBorder,
    },
    Select: {
      colorBgContainer: 'rgba(15, 23, 42, 0.85)',
      optionSelectedBg: t.accentSoft,
    },
    Button: {
      primaryShadow: '0 0 20px -4px rgba(34, 211, 238, 0.45)',
    },
  },
};
