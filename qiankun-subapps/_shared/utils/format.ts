/** 格式化为简短中文日期 */
export function formatDate(value?: string, fallback = '—'): string {
  if (!value) return fallback;
  return new Date(value).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
  });
}

/** 技术栈字符串拆分为标签数组 */
export function splitStack(stack?: string): string[] {
  if (!stack) return [];
  return stack
    .split(/[,，、|/]/)
    .map((item) => item.trim())
    .filter(Boolean);
}
