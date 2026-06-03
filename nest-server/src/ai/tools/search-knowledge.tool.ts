import { tool } from 'langchain';
import * as z from 'zod';
import type { AiVectorStoreService } from '../services/ai-vector-store.service';

/**
 * RAG 检索工具：从 LanceDB 知识库检索相关片段。
 */
export function createSearchKnowledgeTool(vectorStore: AiVectorStoreService) {
  return tool(
    async ({ query, topK }) => {
      const results = await vectorStore.similaritySearch(query, topK ?? 5);
      if (!results.length) {
        return '未找到相关知识库内容。';
      }
      return results
        .map(
          (r, i) =>
            `[${i + 1}] 来源：${r.source} / ${r.title}${r.slug ? ` (slug: ${r.slug})` : ''}\n${r.text}`,
        )
        .join('\n\n---\n\n');
    },
    {
      name: 'search_knowledge_base',
      description:
        '从站点知识库（博客、项目、留言、系统日志）检索与用户问题相关的信息。回答站点内容相关问题前必须先调用此工具。',
      schema: z.object({
        query: z.string().describe('检索关键词或自然语言问句'),
        topK: z.number().optional().describe('返回条数，默认 5'),
      }),
    },
  );
}
