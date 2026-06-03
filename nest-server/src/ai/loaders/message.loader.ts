import { Document } from '@langchain/core/documents';
import type { Message } from '@prisma/client';

/** 将留言记录转为 LangChain Document */
export function loadMessages(messages: Message[]): Document[] {
  return messages.map((m) => {
    const parts = [
      `昵称：${m.nickname}`,
      m.contact ? `联系方式：${m.contact}` : '',
      `留言内容：${m.content}`,
      `时间：${m.createdAt.toISOString()}`,
    ].filter(Boolean);

    return new Document({
      pageContent: parts.join('\n'),
      metadata: {
        source: 'messages',
        sourceId: String(m.id),
        title: `留言-${m.nickname}`,
      },
    });
  });
}
