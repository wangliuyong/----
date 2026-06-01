/** 根据基座主题同步 document 的 dark 类（配合 Tailwind dark:） */
export function applyTheme(theme?: string) {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

/** Qiankun 全局状态中的主题字段 */
export interface GlobalState {
  theme?: string;
}
