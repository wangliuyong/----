/** AI 消息内容块类型 */
export type AiMessageBlock =
  | { type: 'tag'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; ordered: boolean; items: string[] };

/**
 * 将 AI 纯文本解析为可友好展示的内容块
 * - 识别开头【标签】
 * - 段落按空行拆分
 * - 识别有序/无序列表
 */
export function parseAiMessageContent(raw: string): AiMessageBlock[] {
  const trimmed = raw.trim();
  if (!trimmed) return [];

  const blocks: AiMessageBlock[] = [];
  let rest = trimmed;

  /** 提取开头的【知识库】类标签 */
  const tagMatch = rest.match(/^【[^】]+】/);
  if (tagMatch) {
    blocks.push({ type: 'tag', text: tagMatch[0] });
    rest = rest.slice(tagMatch[0].length).trim();
  }

  if (!rest) return blocks;

  const sections = rest.split(/\n{2,}/);
  for (const section of sections) {
    const lines = section
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
    if (!lines.length) continue;

    const ordered = lines.every((line) => /^\d+[.、)]\s/.test(line));
    const unordered = lines.every((line) => /^[-•*]\s/.test(line));

    if ((ordered || unordered) && lines.length >= 1) {
      blocks.push({
        type: 'list',
        ordered,
        items: lines.map((line) =>
          line.replace(/^(?:\d+[.、)]|[-•*])\s+/, '').trim(),
        ),
      });
      continue;
    }

    blocks.push({ type: 'paragraph', text: section.trim() });
  }

  return blocks;
}

/** 流式输出过程中，对未闭合段落做兜底展示 */
export function parseAiMessageContentSafe(raw: string): AiMessageBlock[] {
  const blocks = parseAiMessageContent(raw);
  if (blocks.length || !raw) return blocks;
  return [{ type: 'paragraph', text: raw }];
}
