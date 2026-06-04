/** 用户问答列表：时间格式化等工具 */
export function formatSessionTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString('zh-CN', { hour12: false });
}

/** 会话 ID 短显（前 8 位） */
export function shortSessionId(id: string): string {
  if (id.length <= 12) return id;
  return `${id.slice(0, 8)}…`;
}
